class cgIShape {
    constructor () {
        this.points = [];
        this.bary = [];
        this.indices = [];
        this.normals=[];
        this.uv = [];
    }
    
    addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        var nverts = this.points.length / 3;
        
        // push first vertex
        this.points.push(x0);  this.bary.push (1.0);
        this.points.push(y0);  this.bary.push (0.0);
        this.points.push(z0);  this.bary.push (0.0);
        this.indices.push(nverts);
        nverts++;
        
        // push second vertex
        this.points.push(x1); this.bary.push (0.0);
        this.points.push(y1); this.bary.push (1.0);
        this.points.push(z1); this.bary.push (0.0);
        this.indices.push(nverts);
        nverts++
        
        // push third vertex
        this.points.push(x2); this.bary.push (0.0);
        this.points.push(y2); this.bary.push (0.0);
        this.points.push(z2); this.bary.push (1.0);
        this.indices.push(nverts);
        nverts++;
    }
    
    addNormal (x0,y0,z0,x1,y1,z1,x2,y2,z2) {
        
        // push first normal
        this.normals.push(x0);
        this.normals.push(y0);
        this.normals.push(z0);
        
        // push second normal
        this.normals.push(x1);
        this.normals.push(y1);
        this.normals.push(z1);
        
        // push third normal
        this.normals.push(x2);
        this.normals.push(y2);
        this.normals.push(z2);

    }
    
    adduv (u0, v0, u1, v1, u2, v2) {
        // push first uv
        this.uv.push(u0);
        this.uv.push(v0);
        
        // push second uv
        this.uv.push(u1);
        this.uv.push(v1);
        
        // push third uv
        this.uv.push(u2);
        this.uv.push(v2);
       
    }
}

class Cube extends cgIShape {
    
    constructor (subdivisions) {
        super();
        this.makeCube (subdivisions);
    }
    
    makeCube (subdivisions)  {
        
        if(subdivisions < 1) subdivisions = 1
        
        var x0 = -0.5;
        var y0 = -0.5;
        var incr = 1.0/subdivisions;
        var t1 = 0;
        
        for (t1 = 0; t1 < subdivisions; t1++) {
            var valy = (t1* incr);
            var t2;
            for (t2=0; t2<subdivisions; t2++) {
                var valx = (t2 * incr)
                
                // Front
                this.addTriangle(x0+valx,y0+valy, 0.5, x0+valx+incr,y0+valy ,0.5, x0+valx+incr, y0+valy+incr, 0.5)
                this.addNormal (0, 0, 1, 0, 0, 1, 0, 0, 1);
                this.adduv (valx, valy, valx+incr, valy, valx+incr, valy+incr);
                this.addTriangle(x0+valx+incr,y0+valy+incr, 0.5, x0+valx,y0+valy+incr,0.5, x0+valx, y0+valy, 0.5)
                this.addNormal (0, 0, 1, 0, 0, 1, 0, 0, 1);
                this.adduv (valx+incr, valy+incr, valx, valy+incr, valx, valy);
                
                // Back
                this.addTriangle(x0+valx,y0+valy , -0.5, x0+valx+incr, y0+valy+incr, -0.5, x0+valx+incr, y0+valy,-0.5)
                this.addNormal (0, 0, -1, 0, 0, -1, 0, 0, -1);
                this.adduv (valx, valy, valx+incr, valy+incr, valx+incr, valy);
                this.addTriangle(x0+valx,y0+valy, -0.5, x0+valx, y0+valy+incr, -0.5,  x0+valx+incr, y0+valy+incr,-0.5)
                this.addNormal (0, 0, -1, 0, 0, -1, 0, 0, -1);
                this.adduv (valx, valy, valx, valy+incr, valx+incr, valy+incr );
                
                // Left Face
                this.addTriangle(-0.5, y0+valy, x0+valx, -0.5, y0+valy, x0+valx+incr, -0.5, y0+valy+incr, x0+valx+incr)
                this.addNormal (-1, 0, 0, -1, 0, 0, -1, 0, 0);
                this.adduv (valx, valy, valx+incr, valy, valx+incr, valy+incr );
                this.addTriangle(-0.5, y0+valy+incr, x0+valx+incr, -0.5, y0+valy+incr, x0+valx, -0.5, y0+valy, x0+valx)
                this.addNormal (-1, 0, 0, -1, 0, 0, -1, 0, 0);
                this.adduv (valx+incr, valy+incr, valx, valy+incr, valx,  valy);
                
                // Right Face
                this.addTriangle(0.5, y0+valy, x0+valx+incr, 0.5, y0+valy, x0+valx, 0.5, y0+valy+incr, x0+valx)
                this.addNormal (1, 0, 0, 1, 0, 0, 1, 0, 0);
                this.adduv (valx+incr, valy, valx, valy, valx, valy+incr );
                this.addTriangle(0.5, y0+valy+incr, x0+valx, 0.5, y0+valy+incr, x0+valx+incr, 0.5, y0+valy, x0+valx+incr)
                this.addNormal (1, 0, 0, 1, 0, 0, 1, 0, 0);
                this.adduv (valx, valy+incr, valx+incr, valy+incr, valx+incr, valy );
                
                // Top Face
                this.addTriangle(x0+valx, 0.5, y0+valy+incr, x0+valx+incr, 0.5, y0+valy+incr, x0+valx, 0.5, y0+valy)
                this.addNormal (0, 1, 0, 0, 1, 0, 0, 1, 0);
                this.adduv (valx, valy+incr, valx+incr, valy+incr, valx,valy);
                this.addTriangle(x0+valx, 0.5, y0+valy, x0+valx+incr, 0.5, y0+valy+incr, x0+valx+incr, 0.5, y0+valy)
                this.addNormal (0, 1, 0, 0, 1, 0, 0, 1, 0);
                this.adduv (valx,valy,valx+incr,valy+incr,valx+incr,valy)
                
                // Bottom Face
                this.addTriangle(x0+valx, -0.5, y0+valy, x0+valx+incr, -0.5, y0+valy+incr, x0+valx, -0.5, y0+valy+incr)
                this.addNormal (0, -1, 0, 0, -1, 0, 0, -1, 0);
                this.adduv (valx,valy, valx+incr, valy+incr, valx, valy+incr );
                this.addTriangle(x0+valx, -0.5, y0+valy, x0+valx+incr, -0.5, y0+valy, x0+valx+incr, -0.5, y0+valy+incr)
                this.addNormal (0, -1, 0, 0, -1, 0, 0, -1, 0);
                this.adduv (valx, valy, valx+incr, valy,valx+incr, valy+incr);
                }
        }
    }
}


class Cylinder extends cgIShape {

    constructor (radialdivision,heightdivision) {
        super();
        this.makeCylinder (radialdivision,heightdivision);
    }
    
    makeCylinder (radialdivision,heightdivision){
        
        var y0 = -0.5;
        var y1 = 0.5;
        
        var radius = 0.5;
                
        if(radialdivision < 3) radialdivision = 3;
        if(heightdivision < 1) heightdivision = 1
                
        var angles = 360.0 /radialdivision;
        var incr = 1.0/heightdivision;
            
        let u0, v0, u1, v1, u2, v2, u, v;
        let udist = 1.0 / radialdivision;
        let vdist = 1.0 / heightdivision;
        
        // caps
        var i, j;
        var t2 = 0.0;
        let x0, z0, x1, z1, x2, y2, z2;
        for (i=0; i < radialdivision;i++) {
            x0 = radius * Math.cos(radians(t2))
            z0 = radius * Math.sin(radians(t2))
                 
            x1 = radius * Math.cos(radians(t2+angles))
            z1 = radius * Math.sin(radians(t2+angles))
            
            u0 = x0 + 0.5;
            v0 = z0 + 0.5;
            
            u1 = x1 + 0.5;
            v1 = z1 + 0.5;
            
            //bottom cylinder
            this.addTriangle(x0,y0,z0,0,y0,0,x1,y0,z1)
            this.addNormal (0.0, -1.0, 0, 0.0, -1.0, 0, 0.0, -1.0, 0 );
            this.adduv (u0, 1.0 - (v0), 0.5, 0.5, u1, 1.0 - (v1));
            
            //top cylinder
            this.addTriangle(x1,y1,z1,0,y1,0,x0,y1,z0)
            this.addNormal (0.0, 1.0, 0, 0.0, 1.0, 0, 0.0, 1.0, 0 );
            this.adduv (u1, 1.0 - (v1), 0.5, 0.5, u0, 1.0- (v0));
            
            t2 += angles;
        }
        
        // sides
        v = 1.0;
        for (i=0; i < heightdivision; i++) {
            var val = i * incr;
            t2 =0.0;
            u = 1.0;
            for (j=0; j < radialdivision; j++) {
                x0 = radius * Math.cos(radians(t2));
                z0 = radius * Math.sin(radians(t2));
                
                x1 = radius * Math.cos(radians(t2+angles));
                z1 = radius * Math.sin(radians(t2+angles));
                
                // connect the faces with suitable y subdivision
                this.addTriangle(x0,y0+val,z0,x1,y0+val,z1,x1,y0+val+incr,z1);
                this.addNormal (x0, 0.0, z0, x1, 0.0, z1, x1, 0.0, z1);
                this.adduv (u, 1.0 - v, u-udist, 1.0 - v, u-udist, 1.0 - (v-vdist));
                
                this.addTriangle(x0,y0+val,z0,x1,y0+val+incr,z1,x0,y0+val+incr,z0);
                this.addNormal (x0, 0.0, z0, x1, 0.0, z1, x0, 0.0, z0);
                this.adduv (u, 1.0 - v, u-udist, 1.0 - (v-vdist), u, 1.0 - (v-vdist));
                
                t2 += angles;
                u -= udist;
            }
            
            v -= vdist;
        }
    }
}

class Cone extends cgIShape {

    constructor (radialdivision, heightdivision) {
        super();
        this.makeCone (radialdivision, heightdivision);
    }
    
    
    makeCone (radialdivision, heightdivision) {
    
    let y0 = -0.5;
    let y1 = 0.5;
    let radius = 0.5;
    
    if(radialdivision < 3) radialdivision = 3;
    if(heightdivision < 1) heightdivision = 1
            
    let angles = 360.0 /radialdivision;
    let incr = 1.0/heightdivision;
            
    var i, j;
    var x0, x1, z0, z1;
    var t2 = 0.0;
    var xx0, yy0, zz0, xx1, yy1, zz1, xx2, yy2, zz2;
        
    let u0, v0, u1, v1, u2, v2, u, v;
    let udist = 1.0 / radialdivision;
    let vdist = 1.0 / heightdivision;
        
    // top part of cone + disc bottom
    let firstlevel_radius = radius / heightdivision;
    u = 0.0;
    for (j = 0; j < radialdivision; j++) {
        
        x0 = firstlevel_radius * Math.cos(radians(t2));
        z0 = firstlevel_radius * Math.sin(radians(t2));
                          
        x1 = firstlevel_radius * Math.cos(radians(t2+angles));
        z1 = firstlevel_radius * Math.sin(radians(t2+angles));
        
        xx0 = 0.0; yy0 = y1; zz0 = 0.0;
        xx1 = x1; yy1 = y1 - incr; zz1 = z1;
        xx2 = x0; yy2 = y1 - incr; zz2 = z0;
        
        // top part of cone
        this.addTriangle(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
        this.addConeNormal(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
        this.adduv (0.0, 0.0, u+udist, vdist, u, vdist);
        
        // bottom
        x0 = radius * Math.cos(radians(t2));
        z0 = radius * Math.sin(radians(t2));
                          
        x1 = radius * Math.cos(radians(t2+angles));
        z1 = radius * Math.sin(radians(t2+angles));
        
        xx0 = 0.0; yy0 = y0; zz0 = 0.0;
        xx1 = x1; yy1 = y0; zz1 = z1;
        xx2 = x0; yy2 = y0; zz2 = z0;
        
        this.addTriangle(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
        this.addConeNormal(0,-1, 0, 0,-1, 0, 0,-1, 0);
        this.adduv (0.5, 0.5, x1 + 0.5, 1.0 - (z1 + 0.5), x0 + 0.5, 1.0 - (z0 + 0.5));
        
        t2 += angles;
        u+= udist;
    }
    
    // interior
    v = 1.0;
    for (i=0; i < heightdivision; i++) {
        let val = i * incr;
        let t1 = i;
        let t2 = 0.0;
        u =0.0;
        for (j = 0; j < radialdivision; j++) {
            
            let x0 = radius * Math.cos(radians(t2));
            let z0 = radius * Math.sin(radians(t2));
                              
            let x1 = radius * Math.cos(radians(t2+angles));
            let z1 = radius * Math.sin(radians(t2+angles));
                             
            let radius_bot = radius * (1.0 - (t1*incr));
                            
            let x0_bot = radius_bot * Math.cos(radians(t2));
            let z0_bot = radius_bot * Math.sin(radians(t2));
                            
            let x1_bot = radius_bot * Math.cos(radians(t2+angles));
            let z1_bot = radius_bot * Math.sin(radians(t2+angles));
            
            let radius_top = radius * (1.0 - ((t1+1)*incr));
            
            let x0_top = radius_top * Math.cos(radians(t2));
            let z0_top = radius_top * Math.sin(radians(t2));
                            
            let x1_top = radius_top * Math.cos(radians(t2+angles));
            let z1_top = radius_top * Math.sin(radians(t2+angles));
                            
            radius_bot = radius_top;
                            
            //connect the faces with suitable y subdivision
            
            xx0 = x1_bot;  yy0 = y0+val; zz0 = z1_bot;
            xx1 = x0_top; yy1 = y0+val+incr; zz1 = z0_top;
            xx2 = x0_bot; yy2 = y0+val; zz2 = z0_bot;
            
            this.addTriangle(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
            this.addConeNormal(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
            this.adduv (u+udist, 1.0 - v, u, 1.0 - (v-vdist), u, 1.0 - v);
            
            xx0 = x1_bot;  yy0 = y0+val; zz0 = z1_bot;
            xx1 = x1_top; yy1 = y0+val+incr; zz1 = z1_top;
            xx2 = x0_top; yy2 = y0+val+incr; zz2 = z0_top;
            
            this.addTriangle(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
            this.addConeNormal(xx0 ,yy0, zz0, xx1, yy1 ,zz1, xx2 , yy2, zz2);
            this.adduv (u+udist, 1.0 - v, u+udist, 1.0 - (v-vdist), u, 1.0 - (v-vdist));
            
            t2 += angles;
            u += udist;
            }
        v
        v-= vdist;
        }
    }
    
    addConeNormal (x0, y0, z0, x1, y1, z1, x2, y2, z2) {
        
        // first normal
        let nx0 = 2 * x0;
        let ny0 = 0.5;
        let nz0 = 2 * z0;
        let ndist0 = Math.sqrt ((nx0 * nx0) + (ny0 * ny0) + (nz0 * nz0));
        nx0 /= ndist0;
        ny0 /= ndist0;
        nz0 /= ndist0;
        
        // second normal
        let nx1 = 2 * x1;
        let ny1 = 0.5;
        let nz1 = 2 * z1;
        let ndist1 = Math.sqrt ((nx1 * nx1) + (ny1 * ny1) + (nz1 * nz1));
        nx1 /= ndist1;
        ny1 /= ndist1;
        nz1 /= ndist1;
        
        // third normal
        let nx2 = 2 * x2;
        let ny2 = 0.5;
        let nz2 = 2 * z2;
        let ndist2 = Math.sqrt ((nx2 * nx2) + (ny2 * ny2) + (nz2 * nz2));
        nx2 /= ndist2;
        ny2 /= ndist2;
        nz2 /= ndist2;
        
        this.addNormal (nx0, ny0, nz0, nx1, ny1, nz1, nx2, ny2, nz2);
    }
}
    
class Sphere extends cgIShape {

    constructor (slices, stacks) {
        super();
        this.makeSphere (slices, stacks);
    }
    
    makeSphere (slices, stacks) {
        //let y0 = 0.5;
        //let y1 = -0.5;
        let x0, y0, z0, x1, y1, z1, x2, y2, z2;
        let u0, v0, u1, v1, u2, v2;
        let radius = 0.5;
                
        if(slices < 3) slices = 3;
        if(stacks < 3) stacks = 3;
        
        let thetadist = 6.28 / slices;
        let phidist = 3.14 / stacks;
        
        let udist = 1.0 / slices;
        let vdist = 1.0 / stacks;
        
        let phi = phidist;
        let theta = 0.0;
        let thisSinPhi = 0.0;
        let thisCosPhi = 1.0;
        let u = 0.0;
        let v = 0.0;
        
        let nextSinPhi  = Math.sin(phidist);
        let nextCosPhi = Math.cos(phidist);
        
        let thisZ = radius;
        let nextZ = radius * nextCosPhi;
        
        // Top cone
        var i,j;
        u=1.0;
        for (j=0; j < slices;j++) {
            
            v = 0.0;
        
            let thisSinTheta = Math.sin(theta);
            let thisCosTheta = Math.cos(theta);
        
            let nextSinTheta = Math.sin(theta + thetadist);
            let nextCosTheta = Math.cos(theta + thetadist);
            
            x0 = 0.0;
            y0 = radius;
            z0 = 0.0;
            u0 = 0.0;
            v0 = 0.0;
            
            z1 = (nextCosTheta*nextSinPhi*radius);
            y1 = nextZ;
            x1 = (nextSinTheta*nextSinPhi*radius);
            u1 = u - udist;
            v1 = v + vdist;
            
            z2 = (thisCosTheta*nextSinPhi*radius);
            y2 = nextZ;
            x2 = (thisSinTheta*nextSinPhi*radius);
            u2 = u;
            v2 = v + vdist;
            
            this.addTriangle(x0, y0, z0, x2, y2, z2, x1, y1, z1);
            this.addNormal (x0, y0, z0, x2, y2, z2, x1, y1, z1);
            this.adduv (u0, v0, u2, v2, u1, v1);
            
            theta += thetadist
            u -= udist;
            
        }
        
        // Interior stacks
        //v = vdist;
        v = vdist;
        for (i = 1; i < stacks; i++) {
            
            thisSinPhi = Math.sin(phi);
            thisCosPhi = Math.cos(phi);
            nextSinPhi = Math.sin(phi + phidist);
            nextCosPhi = Math.cos(phi + phidist);
            thisZ = radius * thisCosPhi;
            nextZ = radius * nextCosPhi;
            
            theta = 0.0;
            //u = 0.0;
            u = 1.0;
            for (j=0; j<=slices; j++) {
                let thisSinTheta= Math.sin(theta);
                let thisCosTheta = Math.cos(theta);
                let nextSinTheta = Math.sin(theta + thetadist);
                let nextCosTheta = Math.cos(theta + thetadist);
                
                z0 = (thisCosTheta*thisSinPhi*radius);
                y0 = thisZ;
                x0 = (thisSinTheta*thisSinPhi*radius);
                u0 = u;
                v0 = v;
                
                z1 = (nextCosTheta*thisSinPhi*radius);
                y1 = thisZ;
                x1 = (nextSinTheta*thisSinPhi*radius);
                u1 = u - udist;
                v1 = v;
                
                z2 = (thisCosTheta*nextSinPhi*radius);
                y2 = nextZ;
                x2 = (thisSinTheta*nextSinPhi*radius);
                u2 = u;
                v2 = v + vdist;

                
                this.addTriangle(x2, y2, z2, x1, y1, z1, x0, y0, z0);
                this.addNormal (x2, y2, z2, x1, y1, z1, x0, y0, z0);
                this.adduv (1.0 - u2, 1.0 - v2, 1.0 - u1, 1.0 - v1, 1.0 - u0, 1.0 - v0);
                
                z0 = (nextCosTheta*thisSinPhi*radius);
                y0 = thisZ;
                x0 = (nextSinTheta*thisSinPhi*radius);
                u0 = u - udist;
                v0 = v;
                
                z1 = (nextCosTheta*nextSinPhi*radius);
                y1 = nextZ;
                x1 = (nextSinTheta*nextSinPhi*radius);
                u1 = u - udist;
                v1 = v + vdist;
                
                z2 = (thisCosTheta*nextSinPhi*radius);
                y2 = nextZ;
                x2 = (thisSinTheta*nextSinPhi*radius);
                u2 = u;
                v2 = v + vdist
            
                
                this.addTriangle(x0, y0, z0, x2, y2, z2, x1, y1, z1);
                this.addNormal (x0, y0, z0, x2, y2, z2, x1, y1, z1);
                this.adduv (1.0 - u0, 1.0 - v0, 1.0 - u2, 1.0 - v2, 1.0 - u1, 1.0 - v1);
                
                theta += thetadist;
                u -= udist;
        
            }
            
            phi += phidist;
            v+= vdist;
        }
        
        // Lower pole
        u = 1.0;
        v = 1.0;
        theta = 0.0;
        thisSinPhi = Math.sin(phi);
        thisCosPhi = Math.cos(phi);
        nextSinPhi = 0.0;
        nextCosPhi = -1.0;
        thisZ = radius * thisCosPhi;
        nextZ = -1.0 * radius;
        
        for (j=0; j < slices; j++) {
            let thisSinTheta = Math.sin(theta);
            let thisCosTheta = Math.cos(theta);
            let nextSinTheta = Math.sin(theta + thetadist);
            let nextCosTheta = Math.cos(theta + thetadist);
            
            z0 = (thisCosTheta*thisSinPhi*radius);
            y0 = nextZ;
            x0 = (thisSinTheta*thisSinPhi*radius);
            u0 = u;
            v0 = v;
            
            z1 = (nextCosTheta*thisSinPhi*radius);
            y1 = nextZ;
            x1 = (nextSinTheta*thisSinPhi*radius);
            u1 = u - udist;
            v1 = v;
            
            z2 = 0.0;
            y2 = -1.0 * radius;
            x2 = 0.0;
            u2 = 1.0;
            v2 = 1.0;
               
            this.addTriangle(x0, y0, z0, x2, y2, z2, x1, y1, z1);
            this.addNormal (x0, y0, z0, x2, y2, z2, x1, y1, z1);
            this.adduv (u0, v0, u2, v2, u1, v1);
               
            theta += thetadist;
            u -= udist;
        }

    }

}


function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

