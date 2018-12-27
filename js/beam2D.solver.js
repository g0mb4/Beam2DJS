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
        this.K = this.createCompleteStiffnessMatrix();

        this.p = math.zeros(this.K._size[0], 1);    // n x 1

        this.applyBoundaryConditions(this.p, this.K);

        this.d = math.lusolve(this.K, this.p);

        this.v = [];
        for(var i = 0; i < this.env.getPointsSize() - 1; i++){
            var p1 = this.env.getPoint(i);
            var p2 = this.env.getPoint(i + 1);

            var L = sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

            for(var x = p1.x; x < p2.x; x += this.dx){
                var v = this.getvx(this.d, L, x);

                this.v.push({ x: x, v: v._data[0]});
            }
        }
    }

    getvx(d, L, x){
        var N =  math.matrix([(1/(L * L * L)) * (L * L * L - 3 * L * x * x + 2 * x * x * x),
                              (1/(L * L))     * (L * L * x - 2 * L * x * x + x * x * x),
                              (1/(L * L * L)) * (3 * L * x * x - 2 * x * x * x),
                              (1/(L * L ))    * (-L * x * x + x * x * x)]);

        var v = math.multiply(N, d);
        return v;
    }

    resolveStructure(){
        this.structure = [];

        for(var i = 0; i < this.env.getPointsSize(); i++){
            var asd = [];
            var p = this.env.getPoint(i);
            for(var j = 0; j < this.env.getObjectsSize(); j++){
                var o = this.env.getObjectIndex(j);
                if(o.type == "support"){
                    if(o.x == p.x && o.y == p.y){
                        asd.push(o);
                    }
                } else if(o.type == "load"){
                    if(o.load_type == "load_force" || o.load_type == "load_moment"){
                        if(o.x1 == p.x && o.y1 == p.y){
                            asd.push(o);
                        }
                    }
                }
            }

            this.structure.push(asd);
        }
    }

    createStiffnessMatrix(p1, p2){
        var L = sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        var K1 = math.matrix([[    12,     6 * L,    -12,     6 * L ],
                                       [ 6 * L, 4 * L * L, -6 * L, 2 * L * L ],
                                       [   -12,    -6 * L,     12,    -6 * L ],
                                       [ 6 * L, 2 * L * L, -6 * L, 4 * L * L ]]);

        var IE = (this.I * this.E) / (L * L * L);
        var K = math.multiply(IE, K1);

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

        var K;
        // add matricies if more than 2
        for(var i = 0; i < Ks.length; i++){
            K = Ks[0];  // for now!!!!
        }

        return K;
    }

    zeroRow(m, r){
        var size = m._size[1];
        for(var i = 0; i < size; i++){
            m.subset(math.index(r, i), 0);
        }
    }

    zeroCol(m, c){
        var size = m._size[0];
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

                            this.zeroRow(K, pos_v);
                            this.zeroCol(K, pos_v);
                            K.subset(math.index(pos_v, pos_v), 1);
                        } else {
                            /* TODO */
                        }

                    } else if(cond.support_type == "support_trundle") {
                        if(cond.dir == "dir_y_plus" || cond.dir == "dir_y_minus"){
                            p.subset(math.index(pos_v,   0), 0);

                            this.zeroRow(K, pos_v);
                            this.zeroCol(K, pos_v);
                            K.subset(math.index(pos_v, pos_v), 1);
                        } else {
                            /* TODO */
                        }
                    } else if(cond.support_type == "support_fixed") {
                        p.subset(math.index(pos_v,   0), 0);
                        p.subset(math.index(pos_phi, 0), 0);

                        this.zeroRow(K, pos_v);
                        this.zeroCol(K, pos_v);
                        K.subset(math.index(pos_v, pos_v), 1);

                        this.zeroRow(K, pos_phi);
                        this.zeroCol(K, pos_phi);
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
