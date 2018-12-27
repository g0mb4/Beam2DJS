class Beam2DSolver{

    constructor(env){
        this.env = env;
        this.I = 1;
        this.E = 1;
        this.dx = 1;
    }

    setI(I){
        this.I = I;
    }

    setE(E){
        this.E = E;
    }

    setDX(dx){
        this.dx = dx;
    }

    solve(){
        this.resolveStructure();
        this.K0 = this.createCompleteStiffnessMatrix();
        this.K1 = math.clone(this.K0);

        this.p1 = math.zeros(this.K0.size()[0], 1);    // n x 1

        this.applyBoundaryConditions(this.p1, this.K1);

        this.d = math.lusolve(this.K1, this.p1);        // the magic happens here ;)
        this.p0 = math.multiply(this.K0, this.d);       // calculaton of the reaction forces

        this.generateDeflection();
        this.generateRotation();

        this.generateShear();
        this.generateBendingMoment();
    }

    generateDeflection(){
        this.v = [];
        for(var i = 0; i < this.env.getPointsSize() - 1; i++){
            var p1 = this.env.getPoint(i);
            var p2 = this.env.getPoint(i + 1);

            var L = sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

            for(var x = p1.x, x_loc = 0.0; x <= p2.x; x += this.dx, x_loc += this.dx){
                var d_i = math.zeros(4, 1);
                /* shift local d
                   0 -> 0 1 2 3
                   1 -> 2 3 4 5 ...
                 */
                for(var n = 0; n < 4; n++){
                    d_i._data[n][0] = this.d._data[(i * 2) + n][0]
                }
                var v_dx = this._v(d_i, L, x_loc);

                this.v.push({ x: x, v: v_dx._data[0]});
            }
        }
        return this.v;
    }

    _v(d, L, x){
        var N =  math.matrix([(1/(L * L * L)) * (L * L * L - 3 * L * x * x + 2 * x * x * x),
                              (1/(L * L))     * (L * L * x - 2 * L * x * x + x * x * x),
                              (1/(L * L * L)) * (3 * L * x * x - 2 * x * x * x),
                              (1/(L * L ))    * (-L * x * x + x * x * x)]);

        var v = math.multiply(N, d);
        return v;
    }

    generateRotation(){
        this.phi = [];
        for(var i = 0; i < this.v.length - 1; i++){
            var x = this.v[i].x;
            var v1 = this.v[i].v;
            var v2 = this.v[i + 1].v;

            var phi_dx = (v2 - v1) / this.dx;  // phi = dv/dx

            this.phi.push({ x: x, phi: phi_dx });
        }
        return this.phi;
    }

    generateShear(){
        this.T = [];
        for(var i = 0; i < this.env.getPointsSize() - 1; i++){
            var p1 = this.env.getPoint(i);
            var p2 = this.env.getPoint(i + 1);

            var x = p1.x;
            for(; x <= p2.x; x += this.dx){
                var T_dx = this._T(x);

                this.T.push({ x: x, T: T_dx });
            }

            /* last point, just to be sure */
            if(x != p2.x){
                var T_dx = this._T(p2.x);
                this.T.push({ x: x, T: T_dx });
            }
        }

        return this.T;
    }

    _T(x){
        var T = 0;
        // add loads
        for(var c = 0; c < this.structure.length; c++){
            var conds = this.structure[c];
            for(var j = 0; j < conds.length; j++){
                var cond = conds[j];
                if(cond.type == "load"){
                    /*if(cond.load_type == "load_force") {
                        if(x >= cond.x1){
                            T += cond.c_y1;
                        }
                    }*/
                }
            }
        }

        //add reaction forces
        for(var j = 0; j < this.env.getPointsSize(); j++){
            var p = this.env.getPoint(j);

            if(x >= p.x){
                var R = math.subset(this.p0, math.index(j * 2, 0));
                T += R;
            }
        }

        return T;
    }

    generateBendingMoment(){
        this.M = [];
        for(var i = 0; i < this.env.getPointsSize() - 1; i++){
            var p1 = this.env.getPoint(i);
            var p2 = this.env.getPoint(i + 1);

            var x = p1.x;
            for(; x <= p2.x; x += this.dx){
                var M_dx = this._Mz(x);

                this.M.push({ x: x, M: M_dx });
            }

            /* last point, just to be sure */
            if(x != p2.x){
                var M_dx = this._Mz(x);
                this.M.push({ x: x, M: M_dx });
            }
        }

        return this.M;
    }

    _Mz(x){
        var M = 0;

        for(var i = 0; i * this.dx <= x; i++){
            M += -this.T[i].T * this.dx;
        }

        //add reaction forces
        for(var j = 0; j < this.env.getPointsSize(); j++){
            var p = this.env.getPoint(j);

            if(x >= p.x){
                var M_R = math.subset(this.p0, math.index(j * 2 + 1, 0));
                M += M_R;
            }
        }

        return M;
    }

    resolveStructure(){
        this.structure = [];

        for(var i = 0; i < this.env.getPointsSize(); i++){
            var pointObjects = [];
            var p = this.env.getPoint(i);
            for(var j = 0; j < this.env.getObjectsSize(); j++){
                var o = this.env.getObjectIndex(j);
                if(o.type == "support"){
                    if(o.x == p.x && o.y == p.y){
                        pointObjects.push(o);
                    }
                } else if(o.type == "load"){
                    if(o.load_type == "load_force" || o.load_type == "load_moment"){
                        if(o.x1 == p.x && o.y1 == p.y){
                            pointObjects.push(o);
                        }
                    }
                }
            }

            this.structure.push(pointObjects);
        }
    }

    createStiffnessMatrix(p1, p2){
        var L = sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        var K_c = math.matrix([[    12,     6 * L,    -12,     6 * L ],
                               [ 6 * L, 4 * L * L, -6 * L, 2 * L * L ],
                               [   -12,    -6 * L,     12,    -6 * L ],
                               [ 6 * L, 2 * L * L, -6 * L, 4 * L * L ]]);

        var IE = (this.I * this.E) / (L * L * L);
        var K = math.multiply(IE, K_c);

        return K;
    }

    createCompleteStiffnessMatrix(){
        var Ks = [];
        for(var i = 0; i < this.env.getPointsSize() - 1; i++){
            var p1 = this.env.getPoint(i);
            var p2 = this.env.getPoint(i + 1);
            var K = this.createStiffnessMatrix(p1, p2);
            Ks.push(K);
        }

        var K = Ks[0];
        // add matricies
        for(var i = 1; i < Ks.length; i++){
            var K_i = Ks[i];
            var s_K = K.size()[0];
            K.resize([s_K + 2, s_K + 2]);

            for(var n = 0; n < 4; n++){
                for(var m = 0; m < 4; m++){
                    K._data[(s_K - 2) + n][(s_K - 2) + m] += K_i._data[n][m];
                }
            }
        }

        return K;
    }

    _zeroRow(m, r){
        var size = m.size()[1];     // n x n
        for(var i = 0; i < size; i++){
            m.subset(math.index(r, i), 0);
        }
    }

    _zeroCol(m, c){
        var size = m.size()[0];     // n x n
        for(var i = 0; i < size; i++){
            m.subset(math.index(i, c), 0);
        }
    }

    applyBoundaryConditions(p, K){
        for(var i = 0; i < this.structure.length; i++){
            var conds = this.structure[i];

            var pos_v   = i * 2;
            var pos_phi = (i * 2) + 1;

            for(var j = 0; j < conds.length; j++){
                var cond = conds[j];

                if(cond.type == "support") {
                    if(cond.support_type == "support_wrist") {
                        if(cond.dir == "dir_y_plus" || cond.dir == "dir_y_minus"){
                            p.subset(math.index(pos_v,   0), 0);

                            this._zeroRow(K, pos_v);
                            this._zeroCol(K, pos_v);
                            K.subset(math.index(pos_v, pos_v), 1);
                        } else {
                            /* TODO */
                        }

                    } else if(cond.support_type == "support_trundle") {
                        if(cond.dir == "dir_y_plus" || cond.dir == "dir_y_minus"){
                            p.subset(math.index(pos_v,   0), 0);

                            this._zeroRow(K, pos_v);
                            this._zeroCol(K, pos_v);
                            K.subset(math.index(pos_v, pos_v), 1);
                        } else {
                            /* TODO */
                        }
                    } else if(cond.support_type == "support_fixed") {
                        p.subset(math.index(pos_v,   0), 0);
                        p.subset(math.index(pos_phi, 0), 0);

                        this._zeroRow(K, pos_v);
                        this._zeroCol(K, pos_v);
                        K.subset(math.index(pos_v, pos_v), 1);

                        this._zeroRow(K, pos_phi);
                        this._zeroCol(K, pos_phi);
                        K.subset(math.index(pos_phi, pos_phi), 1);
                    }
                } else if(cond.type == "load"){
                    if(cond.load_type == "load_force") {
                        p.subset(math.index(pos_v,   0), cond.c_y1);
                    } else if(cond.load_type == "load_moment") {
                        p.subset(math.index(pos_phi, 0), cond.c_x1);
                    }
                }
            }
        }
    }
}
