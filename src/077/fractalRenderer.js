// 4D Fractal Renderer with 3D projection
export class FractalRenderer {
    constructor(gl) {
        this.gl = gl;
        this.program = null;
        this.vertexBuffer = null;
        this.mode = 0;
        
        this.init();
    }

    init() {
        // Create shader program
        this.program = this.createShaderProgram();
        
        // Create vertex buffer for a full-screen quad
        const vertices = new Float32Array([
            -1, -1, 0,
             1, -1, 0,
            -1,  1, 0,
             1,  1, 0
        ]);
        
        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
        
        // Get uniform locations
        this.uniforms = {
            uResolution: this.gl.getUniformLocation(this.program, 'uResolution'),
            uTime: this.gl.getUniformLocation(this.program, 'uTime'),
            uViewMatrix: this.gl.getUniformLocation(this.program, 'uViewMatrix'),
            uProjectionMatrix: this.gl.getUniformLocation(this.program, 'uProjectionMatrix'),
            uRotation4D: this.gl.getUniformLocation(this.program, 'uRotation4D'),
            uMode: this.gl.getUniformLocation(this.program, 'uMode')
        };
    }

    createShaderProgram() {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, this.getVertexShaderSource());
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, this.getFragmentShaderSource());
        
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Shader program linking failed:', this.gl.getProgramInfoLog(program));
            return null;
        }
        
        return program;
    }

    compileShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
            return null;
        }
        
        return shader;
    }

    getVertexShaderSource() {
        return `#version 300 es
        precision highp float;
        
        in vec3 aPosition;
        out vec2 vUv;
        
        void main() {
            vUv = aPosition.xy * 0.5 + 0.5;
            gl_Position = vec4(aPosition, 1.0);
        }`;
    }

    getFragmentShaderSource() {
        return `#version 300 es
        precision highp float;
        
        in vec2 vUv;
        out vec4 fragColor;
        
        uniform vec2 uResolution;
        uniform float uTime;
        uniform mat4 uViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform mat4 uRotation4D;
        uniform int uMode;
        
        // 4D to 3D projection
        vec3 project4Dto3D(vec4 p4d) {
            // Apply 4D rotation
            p4d = uRotation4D * p4d;
            
            // Stereographic projection from 4D to 3D
            float w = p4d.w + 2.0;
            return p4d.xyz / w;
        }
        
        // 4D Julia set fractal
        vec4 julia4D(vec4 z, vec4 c) {
            for (int i = 0; i < 8; i++) {
                // 4D complex multiplication
                float x2 = z.x * z.x - z.y * z.y - z.z * z.z - z.w * z.w;
                float y2 = 2.0 * z.x * z.y;
                float z2 = 2.0 * z.x * z.z;
                float w2 = 2.0 * z.x * z.w;
                
                z = vec4(x2, y2, z2, w2) + c;
                
                if (dot(z, z) > 4.0) break;
            }
            return z;
        }
        
        // 4D Mandelbulb-like fractal
        vec4 mandelbulb4D(vec4 pos) {
            vec4 z = pos;
            float dr = 1.0;
            float r = 0.0;
            
            for (int i = 0; i < 4; i++) {
                r = length(z);
                if (r > 2.0) break;
                
                // 4D spherical coordinates
                float theta = acos(z.z / r);
                float phi = atan(z.y, z.x);
                float psi = atan(z.w, length(z.xyz));
                
                dr = pow(r, 7.0) * 8.0 * dr + 1.0;
                
                // Power 8 formula in 4D
                float r8 = pow(r, 8.0);
                float sint = sin(theta * 8.0);
                float cost = cos(theta * 8.0);
                float sinp = sin(phi * 8.0);
                float cosp = cos(phi * 8.0);
                float sinps = sin(psi * 8.0);
                float cosps = cos(psi * 8.0);
                
                z = r8 * vec4(
                    sint * cosp * cosps,
                    sint * sinp * cosps,
                    cost * cosps,
                    sinps
                ) + pos;
            }
            return vec4(0.5 * log(r) * r / dr);
        }
        
        // Distance field for 4D fractal
        float map(vec3 p) {
            // Add time-based 4D rotation
            vec4 p4d = vec4(p, sin(uTime * 0.3) * 0.5);
            
            float d = 1e10;
            
            if (uMode == 0) {
                // Julia set mode
                vec4 c = vec4(
                    cos(uTime * 0.7) * 0.3,
                    sin(uTime * 0.5) * 0.3,
                    cos(uTime * 0.9) * 0.3,
                    sin(uTime * 0.4) * 0.3
                );
                vec4 z = julia4D(p4d, c);
                d = length(z) - 1.0;
            } else if (uMode == 1) {
                // Mandelbulb mode
                vec4 bulb = mandelbulb4D(p4d);
                d = bulb.x;
            } else {
                // Hybrid mode
                vec4 c = vec4(0.2, -0.3, 0.1, -0.2);
                vec4 z = julia4D(p4d * 0.5, c);
                vec4 bulb = mandelbulb4D(p4d * 0.7);
                d = min(length(z) - 0.5, bulb.x);
            }
            
            return d;
        }
        
        // Raymarching
        vec3 raymarch(vec3 ro, vec3 rd) {
            float t = 0.0;
            vec3 col = vec3(0.0);
            
            for (int i = 0; i < 100; i++) {
                vec3 p = ro + rd * t;
                float d = map(p);
                
                if (d < 0.001) {
                    // Hit - calculate color based on position and iteration
                    float n = float(i) / 100.0;
                    col = vec3(
                        0.5 + 0.5 * cos(n * 6.28 + uTime),
                        0.5 + 0.5 * cos(n * 6.28 + uTime + 2.0),
                        0.5 + 0.5 * cos(n * 6.28 + uTime + 4.0)
                    );
                    
                    // Add glow based on distance
                    col += vec3(0.2, 0.3, 0.5) * exp(-t * 0.5);
                    break;
                }
                
                if (t > 10.0) break;
                
                t += d * 0.8;
            }
            
            return col;
        }
        
        void main() {
            vec2 uv = (vUv - 0.5) * 2.0;
            uv.x *= uResolution.x / uResolution.y;
            
            // Camera setup
            vec3 ro = (uViewMatrix * vec4(0.0, 0.0, 3.0, 1.0)).xyz;
            vec3 rd = normalize((uViewMatrix * vec4(uv, -1.0, 0.0)).xyz);
            
            // Raymarch the 4D fractal
            vec3 col = raymarch(ro, rd);
            
            // Add bloom effect
            col = pow(col, vec3(0.8));
            col += vec3(0.1, 0.05, 0.2) * 0.2;
            
            // Output
            fragColor = vec4(col, 1.0);
        }`;
    }

    setMode(mode) {
        this.mode = mode;
    }

    render(viewMatrix, projectionMatrix, time, rotation4D) {
        const gl = this.gl;
        
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(this.program);
        
        // Set uniforms
        gl.uniform2f(this.uniforms.uResolution, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(this.uniforms.uTime, time);
        gl.uniformMatrix4fv(this.uniforms.uViewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(this.uniforms.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.uniforms.uRotation4D, false, rotation4D);
        gl.uniform1i(this.uniforms.uMode, this.mode);
        
        // Bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        const aPosition = gl.getAttribLocation(this.program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
        
        // Draw
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}