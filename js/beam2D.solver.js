class Beam2DSolver{

    constructor(env){
        this.env = env;
        this.I = 1;
        this.E = 1;
        this.dx = 1;
    }

    solve(){
        this.resolveStructure();
        this.K0 = this.createCompleteStiffnessMatrix();
        this.K1 = math.clone(this.K0);

        this.p1 = math.zeros(this.K0.size()[0], 1);    // n x 1

        this.applyBoundaryConditions(this.p1, this.K1);

        this.d = math.lusolve(this.K1, this.p1);        // the magic happens here ;)
        this.p0 = math.multiply(this.K0, this.d);       // calculaton of the reaction forces
    }

    resolveStructure(){
        this.structure = [];

        /* add supports, forces and moment */
        for(var i = 0; i < this.env.getPointsSize(); i++){
            var p = this.env.getPoint(i);

            var pointObject = {
                point : { x: p.x, y: p.y },
                pointData : [],
            }

            for(var j = 0; j < this.env.getObjectsSize(); j++){
                var o = this.env.getObjectIndex(j);
                if(o.type == "support"){
                    if(o.x == p.x && o.y == p.y){
                        pointObject.pointData.push(o);
                    }
                } else if(o.type == "load"){
                    if(o.load_type == "load_force" || o.load_type == "load_moment"){
                        if(o.x1 == p.x && o.y1 == p.y){
                            pointObject.pointData.push(o);
                        }
                    }
                }
            }
            this.structure.push(pointObject);
        }

        /* add distributed loads */
        for(var i = 0; i < this.env.getPointsSize() - 1; i++){
            var p1 = this.env.getPoint(i);
            var p2 = this.env.getPoint(i + 1);

            for(var j = 0; j < this.env.getObjectsSize(); j++){
                var o = this.env.getObjectIndex(j);
                if(o.type == "load"){
                    if(o.load_type == "load_dist_const"){
                        this.structure[i].pointData.push(o);    // for Ty, Mhz diagrams

                        if(o.x1 == p.x){
                            var L = sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
                            var F = (o.c_y1 * L) / 2;       // calculate equivalent force (q * L) / 2
                            var M = (o.c_y1 * L * L) / 12;  // calculate equivalent moment (q * L * L) / 12

                            this.structure[i    ].push(new Load(-1, p1.x, p1.y, 0, 0, "load_force", 0, F, 0, 0));
                            this.structure[i + 1].push(new Load(-1, p2.x, p2.y, 0, 0, "load_force", 0, F, 0, 0));

                            this.structure[i    ].push(new Load(-1, p1.x, p1.y, 0, 0, "load_moment", -M, 0, 0, 0));  // M is negative !!
                            this.structure[i + 1].push(new Load(-1, p2.x, p2.y, 0, 0, "load_moment",  M, 0, 0, 0));
                        }
                    }
                }
            }
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
        for(var i = 0; i < this.structure.length - 1; i++){
            var p1 = this.structure[i].point;
            var p2 = this.structure[i + 1].point;
            var K = this.createStiffnessMatrix(p1, p2);
            Ks.push(K);
        }

        var K = Ks[0];
        /* add matricies
            K1 = [k1_11 k1_12] K1 = [k2_11 k2_12],  size(kn_xy) = [4x4]
                 [k1_21 k1_22]      [k2_21 k2_22]

           K = [k1_11       k1_12         0]
               [k1_21 (k1_22 + k2_11) k2_12]
               [  0        k2_21      k2_22]
        */

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
        // first add the loads
        for(var i = 0; i < this.structure.length; i++){
            var pointObject = this.structure[i];

            var pos_v   = i * 2;
            var pos_phi = (i * 2) + 1;

            for(var j = 0; j < pointObject.pointData.length; j++){
                var obj = pointObject.pointData[j];

                if(obj.type == "load"){
                    if(obj.load_type == "load_force") {
                        p._data[pos_v][0] += obj.c_y1;      // add force
                    } else if(obj.load_type == "load_moment") {
                        p._data[pos_phi][0] += obj.c_x1;    // add moment
                    }
                }
            }
        }

        // then the suports
        for(var i = 0; i < this.structure.length; i++){
            var pointObject = this.structure[i];

            var pos_v   = i * 2;
            var pos_phi = (i * 2) + 1;

            for(var j = 0; j < pointObject.pointData.length; j++){
                var obj = pointObject.pointData[j];

                if(obj.type == "support") {
                    if(obj.support_type == "support_wrist") {
                        if(obj.dir == "dir_y_plus" || obj.dir == "dir_y_minus"){
                            p._data[pos_v][0] = 0;

                            this._zeroRow(K, pos_v);
                            this._zeroCol(K, pos_v);
                            K._data[pos_v][pos_v] = 1;
                        } else {
                            /* TODO */
                        }
                    } else if(obj.support_type == "support_trundle") {
                        if(obj.dir == "dir_y_plus" || obj.dir == "dir_y_minus"){
                            p._data[pos_v][0] = 0;

                            this._zeroRow(K, pos_v);
                            this._zeroCol(K, pos_v);
                            K._data[pos_v][pos_v] = 1;
                        } else {
                            /* TODO */
                        }
                    } else if(obj.support_type == "support_fixed") {
                        p._data[pos_v][0] = 0;
                        p._data[pos_phi][0] = 0;

                        this._zeroRow(K, pos_v);
                        this._zeroCol(K, pos_v);
                        K._data[pos_v][pos_v] = 1;

                        this._zeroRow(K, pos_phi);
                        this._zeroCol(K, pos_phi);
                        K._data[pos_phi][pos_phi] = 1;
                    }
                }
            }
        }
    }

    generateDeflection(){
        this.v = [];
        for(var i = 0; i < this.structure.length - 1; i++){
            var p1 = this.structure[i    ].point;
            var p2 = this.structure[i + 1].point;

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
        /* phi = dv/dx */
        this.phi = [];
        for(var i = 0; i < this.v.length - 1; i++){
            var x1 = this.v[i].x;
            var v1 = this.v[i].v;
            var v2 = this.v[i + 1].v;

            var phi_dx = (v2 - v1) / this.dx;

            this.phi.push({ x: x1, phi: phi_dx });
        }
        return this.phi;
    }

    removeDistForces(){
        /* subrtact distributed forces, moments */
        this.p0_nodist = this.p0.clone();
        for(var i = 0; i < this.structure.length; i++){
            var pos_F = i * 2;
            var pos_M = (i * 2) + 1;
            var objs = this.structure[i].pointData;

            for(var j = 0; j < objs.length; j++){
                var obj = objs[j];
                if(obj.id == -1 && obj.type == "load"){
                    if(obj.load_type == "load_force") {
                        this.p0_nodist._data[pos_F][0] -= obj.c_y1;
                    } else if(obj.load_type == "load_moment") {
                        this.p0_nodist._data[pos_M][0] -= obj.c_x1;
                    }
                }
            }
        }
    }

    generateShear(){
        this.T = [];
        for(var i = 0; i < this.structure.length - 1; i++){
            var p1 = this.structure[i    ].point;
            var p2 = this.structure[i + 1].point;

            var x = p1.x;
            for(; x <= p2.x; x += this.dx){
                var T_dx = this._Ty(x);

                this.T.push({ x: x, T: T_dx });
            }

            /* last point of the section, just to be sure */
            if(x != p2.x){
                var T_dx = this._Ty(p2.x);
                this.T.push({ x: x, T: T_dx });
            }
        }
        return this.T;
    }

    _Ty(x){
        /* Ty(x) - Ty(0) = integral(0, x, q(x), dx) */
        var T = 0;
        /* integral(0, x, q(x), dx) */
        for(var s = 0; s <= x; s += this.dx){
            T += this._q(s) * this.dx;
        }

        /* add forces from calculated p0 */
        for(var i = 0; i < this.structure.length; i++){
            var p = this.structure[i].point;

            if(x >= p.x){
                 T += this.p0_nodist._data[i * 2][0];   // add force
            }
        }

        return T;
    }

    _q(x){
        var q = 0;
        for(var i = 0; i < this.structure.length; i++){
            for(var j = 0; j < this.structure[i].pointData.length; j++){
                var obj = this.structure[i].pointData[j];
                if(obj.type == "load"){
                    if(obj.load_type == "load_dist_const"){
                        if(x >= obj.x1 && x <= obj.x2){
                            return obj.c_y1;
                        }
                    }
                }
            }
        }
        return 0;
    }

    generateBendingMoment(){
        this.M = [];
        for(var i = 0; i < this.structure.length - 1; i++){
            var p1 = this.structure[i    ].point;
            var p2 = this.structure[i + 1].point;

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
        /* M(x) - M(0) = -integral(0, x, T(x), dx) */
        var M = 0;

        /* -integral(0, x, T, dx) */
        for(var i = 0; i * this.dx <= x; i++){
            M += -this.T[i].T * this.dx;
        }

        /* add moments from calculated p0 */
        for(var i = 0; i < this.structure.length; i++){
            var p = this.structure[i].point;

            /* if x is beyond the point */
            if(x >= p.x){
                M += this.p0_nodist._data[i * 2 + 1][0];
            }
        }

        return M;
    }
}
