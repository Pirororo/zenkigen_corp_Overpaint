// import * as THREE from '../../libs/three.module.js';
// import * as THREE from '../../libs/three.js';
// import {} from '../../libs/THREE.MeshLine_overpaint.js';

/**
 *　ラインクラスです。
 */
export default class Overpaint extends THREE.Object3D {
    　　 /**
        * コンストラクターです。
        * @constructor
        */
        constructor(){
    
            super();
            this.init = this.init.bind(this);
            this.createLines = this.createLines.bind(this);
            this.createLine = this.createLine.bind(this);
            this.makeLine = this.makeLine.bind(this);
            this.createCurve = this.createCurve.bind(this);
            this.datUpdate = this.datUpdate.bind(this);
    
    
            var Params = function(){
                this.amount = 50;
                this.lineWidth = 7.0;
                this.width_amp = 0.5;
                this.width_freq = 1.0;
                this.dashGradate = 2.0;
                this.taper = 'none';
                this.strokes = false;
                this.sizeAttenuation = true;
                // this.animateWidth = false;
                this.spread = false;
                this.autoUpdate = true;//これ、DATでいれた値を反映させるのに大事！！！
                // this.animateDashOffset = true;
                // this.strokes = true;

                this.opc_freq = 1.0;
                this.opc_base = 0.4;
                this.rag_speed = 2.0;
                this.offset_speed = -0.01;
            };
            this.params = new Params();
            var gui = new dat.GUI();
            this.datUpdate();
    
            this.lines = [];
            this.clock =  new THREE.Clock();
            
            var TAU = 2 * Math.PI/4;
            this.hexagonGeometry = new THREE.Geometry();
            for( var j = 0; j < TAU - .1; j += TAU / 100/1 ) {
                var v = new THREE.Vector3();
                v.set( Math.cos( j+(Math.PI/180*240) ), Math.sin( j+(Math.PI/180*240) ), 0 );
                this.hexagonGeometry.vertices.push( v );
            }
            // this.hexagonGeometry.vertices.push( this.hexagonGeometry.vertices[ 0 ].clone() );//最後の点
    
            window.addEventListener( 'load', this.init());


        
            var folder1 = gui.addFolder('overpaint');
                // folder1.add( this.params, 'amount', 30, 100 ).onChange( this.datUpdate );
                folder1.add( this.params, 'lineWidth', 0, 20 ).onChange( this.datUpdate );
                folder1.add( this.params, 'width_amp', 0, 10 ).onChange( this.datUpdate );
                folder1.add( this.params, 'width_freq', 0, 5 ).onChange( this.datUpdate );
                folder1.add( this.params, 'dashGradate', 0, 8 ).onChange( this.datUpdate );
                folder1.add( this.params, 'opc_freq', 0, 2 ).onChange( this.datUpdate );
                folder1.add( this.params, 'opc_base', 0, 1 ).onChange( this.datUpdate );
                folder1.add( this.params, 'rag_speed', 0, 3).onChange( this.datUpdate );
                folder1.add( this.params, 'offset_speed', -0.02, 0.02).onChange( this.datUpdate );
            folder1.open();
          
        }
        
        datUpdate() {
            // this.amount = this.params.amount;
            // this.init;
            this.width_amp = this.params.width_amp;
            this.width_freq = this.params.width_freq;
            this.lineWidth = this.params.lineWidth;
            this.dashGradate = this.params.dashGradate;
            this.opc_freq = this.params.opc_freq;
            this.opc_base = this.params.opc_base;
            this.rag_speed = this.params.rag_speed;
            this.offset_speed = this.params.offset_speed;
        }
    
        init() {
            this.clearLines();
            this.createLines();
        }
    
        createLines() {
            for( var j = 0; j < this.params.amount; j++ ) {
                this.createLine(j);
            }
        }
        
        createLine(j) {
            this.makeLine( this.hexagonGeometry, j );
            // if( this.params.curves ) this.makeLine( this.createCurve(j) );
        }
        
         clearLines() {
            this.lines.forEach( function( l ) {
              scene.remove( l );
            } );
            this.lines = [];
          }
        
        makeLine( geo ,j) {
    
            this.g = new MeshLine();
            switch( this.params.taper ) {
                case 'none': this.g.setGeometry( geo ); break;
            }
    
            var colors = [
                0x9FE3ED,//シアン
                0x7E8DF7,//青
                0xB361DF,//紫
            ];
    
            var opacitys = [];
            for(let i =0; i< this.params.amount; i++){
                let opc = Maf.randomInRange( 0.6, 1.0);
                // console.log(opc);
                opacitys.push(opc);
            }
    
            var lineWidths = [];
            for(let i =0; i< this.params.amount; i++){
                let wid = Maf.randomInRange( 5, 15);
                // console.log(wid);
                lineWidths.push(wid);
            }
            
            var dashArrays = [];
            for(let i =0; i< this.params.amount; i++){
                let arrays= Maf.randomInRange(1, 3);
                // console.log(arrays);
                dashArrays.push(arrays);
            }
            
            var dashOffsets = [];
            for(let i =0; i< this.params.amount; i++){
                let offs= ((Math.random()*1));
                // let offs= 0;
                // console.log(offs);
                dashOffsets.push(offs);
            }
    
    
            var material = new MeshLineMaterial( {
                // map: strokeTexture,
                useMap: this.params.strokes,
                color: new THREE.Color( colors[ ~~Maf.randomInRange( 0, colors.length ) ] ),
                // color: new THREE.Color( 0xffffff),
                // opacity: opacitys[ ~~Maf.randomInRange( 0, opacitys.length ) ],
                opacity: 0.0,
                dashArray: dashArrays[ ~~Maf.randomInRange( 0, dashArrays.length ) ],
                dashOffset: dashOffsets[ ~~Maf.randomInRange( 0, dashOffsets.length ) ],
                // dashRatio: this.params.dashRatio,
                dashRatio: 0.0,
                // resolution: resolution,
                // sizeAttenuation: params.sizeAttenuation,
                // lineWidth: this.params.lineWidth,
                // lineWidth: 22,
                lineWidth: lineWidths[ ~~Maf.randomInRange( 0, lineWidths.length ) ],
                // near: camera.near,
                // far: camera.far,
                // depthWrite: false,
                // depthTest: !this.params.strokes,
                depthTest: false,
                // alphaTest: this.params.strokes ? .5 : 0.0,
                transparent: true,
                side: THREE.DoubleSide,
                time: 0.0,
            });
    
            var mesh = new THREE.Mesh( this.g.geometry, material );

            this.r = 190;
            this.space = this.r/(this.params.amount/2);
            // mesh.position.set( 0, Maf.randomInRange( -r, r )-20, 500);
            
            mesh.position.set( 0, j*this.space -this.r-100, 500 );
            // mesh.position.set( 0,0,0 );
            var s = 500 + 10 * Math.random();
            mesh.scale.set( s,s,s );
            // mesh.rotation.set( Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI );
            mesh.rotation.set(100 *Math.PI/180, -20 *Math.PI/180, 0 *Math.PI/180);

            this.add( mesh );
            this.lines.push( mesh );
    
        }
    
        createCurve(wid) {
    
            var s = new THREE.ConstantSpline();
            var rMin = 10;
            var rMax = 300;
            var origin = new THREE.Vector3( Maf.randomInRange( -rMin, rMin ), Maf.randomInRange( -rMin, rMin ), Maf.randomInRange( -rMin, rMin ) );
        
            s.inc = 0.01;
            // s.p0 = new THREE.Vector3( .5 - Math.random(), .5 - Math.random(), .5 - Math.random() );
            s.p0.set( 0, 0, 0 );
            // s.p1 = s.p0.clone().add( new THREE.Vector3( 1.0 + Math.random(), 0.2 - Math.random(), 0.1) );
            // s.p2 = s.p1.clone().add( new THREE.Vector3( 1.0 + Math.random(), 0.0 + Math.random(), 0.1) );
            // s.p3 = s.p2.clone().add( new THREE.Vector3( 1, 1.5 + Math.random(), 0.1) );
    
            s.p1 = s.p0.clone().add( new THREE.Vector3( 0.2 + Math.random(), - Math.random(), 0.0001) );
            s.p2 = s.p1.clone().add( new THREE.Vector3( 0.2 + Math.random(), 0.0 + Math.random(), 0.0001) );
            s.p3 = new THREE.Vector3( 5, 5, 0.1) ;
            s.p0.multiplyScalar( rMin + Math.random() * rMax );
            s.p1.multiplyScalar( rMin + Math.random() * rMax );
            s.p2.multiplyScalar( rMin + Math.random() * rMax );
            s.p3.multiplyScalar( rMin + Math.random() * rMax );
        
            s.calculate();
            var geometry = new THREE.Geometry();
            s.calculateDistances();
            //s.reticulate( { distancePerStep: .1 });
            s.reticulate( { steps: 500 } );
             var geometry = new THREE.Geometry();
        
            for( var j = 0; j < s.lPoints.length - 1; j++ ) {
                geometry.vertices.push( s.lPoints[ j ].clone() );
            }
        
            return geometry;
    
    
    
            // // let randomWid = Math.random()*window.innerWidth*0.2;
            // // // console.log(window.innerWidth);//1440
            // // var geometry = new THREE.Geometry();
            // // for( var i = 0; i < 2; i++ ) {
            // //     geometry.vertices.push( new THREE.Vector3(
            // //         -window.innerWidth/10+ randomWid,
            // //         window.innerHeight/4- window.innerHeight/4*i,
            // //         0
            // //     ));
            // //     // geometry.vertices.push( new THREE.Vector3( -window.innerWidth/5 +(20*wid), window.innerHeight*i, 0));
            // // }
    
            // let randomX = Maf.randomInRange(-150, 150);
            // let randomZ = Maf.randomInRange(-150, 150);
            // // console.log(window.innerWidth);//1440
            // var geometry = new THREE.Geometry();
            // for( var i = 0; i < 2; i++ ) {
            //     geometry.vertices.push( new THREE.Vector3(
            //         randomX,
            //         -150+ (300*i),
            //         randomZ
            //         // Maf.randomInRange(-150, 150)
            //     ));
            // }
    
            // return geometry;
        }
    
    
        update(){
            var params = this.params;
            // var delta = this.clock.getDelta();//0.015~0.020
            var t = this.clock.getElapsedTime();
            this.lines.forEach( function( l, i ) {
                l.material.uniforms.lineWidth.value = params.lineWidth * ( 1 + params.width_amp * Math.sin( params.width_freq * t + i ) );
                l.material.uniforms.dashGradate.value = params.dashGradate;


                // if( params.autoRotate ) l.rotation.y += .125 * delta;
                // l.material.uniforms.visibility.value = this.params.animateVisibility ? (this.time/3000) % 1.0 : 1.0;
                l.material.uniforms.opacity.value = (Math.sin(t *params.opc_freq -(Math.PI/180 *90)) *1.0)/2 +params.opc_base;
                // l.material.uniforms.opacity.value = 1.2;
                l.material.uniforms.time.value = t + i *params.rag_speed;//i入れて正解だったぽい
                l.material.uniforms.dashOffset.value += params.offset_speed;
            } );
    
            // this.backMesh.material.opacity += this.opacitySpeed;
            // if(this.backMesh.material.opacity > 1.0){
            //     this.opacitySpeed *= -1;
            // }else if(this.backMesh.material.opacity <= 0.0){
            //     this.backMesh.material.opacity =0.0;
            // }
    
    
        }
    }
    
    
    // //円形の光用メッシュ
    // const vertex= `
    // // attribute float alpha;
    // // varying float vAlpha;
    // varying vec3 vPosition;
    
    // void main(){
    //     // vAlpha = alpha;
    //     vPosition = position;
    //     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //     // gl_Position = vec4( position, 1.0 );//こっちにしてcircleGeometryのサイズ0.5にすると画面のwidth,heightの0.5の大きさの楕円になる。
    // }
    // `;
    
    // const fragment = `
    // // varying float vAlpha;
    // varying vec3 vPosition;
    // uniform vec2 resolution;
    
    // void main(){
    //     // //右上
    //     // vec2 p = (gl_FragCoord.xy/ resolution)-1.0;
    //     // float len = length(p- vec2(1.0, 1.0)); 
    //     // //ど真ん中
    //     // vec2 p = (gl_FragCoord.xy/ resolution)-1.0;
    //     // float len = length(p- vec2(0.0, 0.0)); 
    
    //     // //右上
    //     // vec2 p = gl_FragCoord.xy/ resolution;
    //     // float len = length(p- vec2(2.0, 2.0)); 
    //     // //左下
    //     // vec2 p = gl_FragCoord.xy/ resolution;
    //     // float len = length(p- vec2(0.0, 0.0)); 
    //     // //ど真ん中
    //     // vec2 p = gl_FragCoord.xy/ resolution;
    //     // float len = length(p- vec2(1.0, 1.0)); 
    
    //     float len = length(vPosition-  vec3(0.0));
        
    //     // gl_FragColor = vec4( vec3(1.0,0.0,0.0), vAlpha*0.5);
    //     gl_FragColor = vec4( vec3(1.0), 1.0/pow(len, 0.1) *0.2);
    // }
    // `;
    
    
    