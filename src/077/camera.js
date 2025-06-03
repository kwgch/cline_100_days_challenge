// Camera controller with 4D rotation support
export class Camera {
    constructor() {
        this.position = [0, 0, 3];
        this.rotation = [0, 0, 0];
        this.rotation4D = [0, 0, 0, 0, 0, 0]; // 6 parameters for 4D rotation
        this.targetPosition = [...this.position];
        this.targetRotation = [...this.rotation];
        this.targetRotation4D = [...this.rotation4D];
        
        this.fov = 60;
        this.aspect = 1;
        this.near = 0.1;
        this.far = 100;
        
        this.smoothing = 0.1;
    }

    reset() {
        this.targetPosition = [0, 0, 3];
        this.targetRotation = [0, 0, 0];
        this.targetRotation4D = [0, 0, 0, 0, 0, 0];
    }

    setAspect(aspect) {
        this.aspect = aspect;
    }

    rotate(deltaX, deltaY) {
        this.targetRotation[0] -= deltaY;
        this.targetRotation[1] -= deltaX;
    }

    rotate4D(axis1, axis2, angle) {
        // 4D rotation in different planes
        const index = axis1 * 3 + axis2;
        if (index < 6) {
            this.targetRotation4D[index] += angle;
        }
    }

    pan(deltaX, deltaY) {
        const scale = this.position[2] * 0.001;
        this.targetPosition[0] += deltaX * scale;
        this.targetPosition[1] -= deltaY * scale;
    }

    zoom(delta) {
        this.targetPosition[2] = Math.max(0.5, Math.min(10, this.targetPosition[2] + delta));
    }

    update(deltaTime) {
        // Smooth interpolation
        for (let i = 0; i < 3; i++) {
            this.position[i] += (this.targetPosition[i] - this.position[i]) * this.smoothing;
            this.rotation[i] += (this.targetRotation[i] - this.rotation[i]) * this.smoothing;
        }
        
        for (let i = 0; i < 6; i++) {
            this.rotation4D[i] += (this.targetRotation4D[i] - this.rotation4D[i]) * this.smoothing;
        }
        
        // Auto-rotate in 4D
        this.targetRotation4D[0] += deltaTime * 0.1;
        this.targetRotation4D[2] += deltaTime * 0.07;
        this.targetRotation4D[4] += deltaTime * 0.13;
    }

    getViewMatrix() {
        const matrix = new Float32Array(16);
        
        // Identity matrix
        matrix[0] = 1; matrix[5] = 1; matrix[10] = 1; matrix[15] = 1;
        
        // Apply rotations
        const pitch = this.rotation[0] * Math.PI / 180;
        const yaw = this.rotation[1] * Math.PI / 180;
        
        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);
        
        // Rotation matrix
        matrix[0] = cosYaw;
        matrix[1] = sinPitch * sinYaw;
        matrix[2] = -cosPitch * sinYaw;
        
        matrix[4] = 0;
        matrix[5] = cosPitch;
        matrix[6] = sinPitch;
        
        matrix[8] = sinYaw;
        matrix[9] = -sinPitch * cosYaw;
        matrix[10] = cosPitch * cosYaw;
        
        // Translation
        matrix[12] = -this.position[0];
        matrix[13] = -this.position[1];
        matrix[14] = -this.position[2];
        
        return matrix;
    }

    getProjectionMatrix() {
        const matrix = new Float32Array(16);
        const f = 1.0 / Math.tan((this.fov * Math.PI / 180) / 2);
        const rangeInv = 1 / (this.near - this.far);
        
        matrix[0] = f / this.aspect;
        matrix[5] = f;
        matrix[10] = (this.near + this.far) * rangeInv;
        matrix[11] = -1;
        matrix[14] = 2 * this.near * this.far * rangeInv;
        
        return matrix;
    }

    getRotation4D() {
        // Create 4D rotation matrix from 6 rotation parameters
        const matrix = new Float32Array(16);
        
        // Identity matrix
        for (let i = 0; i < 16; i++) {
            matrix[i] = (i % 5 === 0) ? 1 : 0;
        }
        
        // Apply rotations in different 4D planes
        const rotations = [
            [0, 1], // XY plane
            [0, 2], // XZ plane
            [0, 3], // XW plane
            [1, 2], // YZ plane
            [1, 3], // YW plane
            [2, 3]  // ZW plane
        ];
        
        rotations.forEach((plane, idx) => {
            const angle = this.rotation4D[idx];
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            
            const temp = new Float32Array(16);
            for (let i = 0; i < 16; i++) {
                temp[i] = (i % 5 === 0) ? 1 : 0;
            }
            
            const [a, b] = plane;
            temp[a * 4 + a] = cos;
            temp[a * 4 + b] = -sin;
            temp[b * 4 + a] = sin;
            temp[b * 4 + b] = cos;
            
            // Multiply matrices
            const result = new Float32Array(16);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    result[i * 4 + j] = 0;
                    for (let k = 0; k < 4; k++) {
                        result[i * 4 + j] += matrix[i * 4 + k] * temp[k * 4 + j];
                    }
                }
            }
            
            matrix.set(result);
        });
        
        return matrix;
    }
}