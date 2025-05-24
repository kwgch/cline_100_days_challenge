precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

vec3 palette(float t, float time) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    // 時間によって色相を変化させる
    float hue_shift = sin(time * 0.1) * 0.5 + 0.5;
    d.x += hue_shift;

    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;

    // 無限ズームの中心点
    vec2 zoom_target = vec2(-0.743643887037151, 0.131825904205330); // 有名な複雑な部分

    // 時間による指数関数的なズーム
    float zoom_speed = 0.5; // ズームの速さ
    float current_zoom = pow(10.0, u_time * zoom_speed); // 時間とともに指数関数的にズーム

    // 画面のUV座標をマンデルブロ集合の座標に変換
    vec2 c = (gl_FragCoord.xy / u_resolution - 0.5) * 4.0 / current_zoom; // ズームレベルに応じて範囲を縮小
    c.x *= u_resolution.x / u_resolution.y; // アスペクト比補正
    c += zoom_target; // ズームの中心点を加算して移動

    vec2 z = vec2(0.0, 0.0);
    float i;
    // イテレーション回数を増やし、より詳細な描画を可能にする
    for (int j = 0; j < 200; j++) { // 100から200に増加
        i = float(j);
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) break;
    }

    vec3 color = vec3(0.0);
    if (i < 200.0) { // イテレーション回数に合わせて変更
        // スムーズな色付け
        float smooth_i = i + 1.0 - log(log(dot(z, z))) / log(2.0);
        // モダンな色使いに調整
        color = palette(smooth_i * 0.02, u_time);
    } else {
        // マンデルブロ集合の内部（発散しない領域）の色付け
        // zの偏角（角度）を利用して色を生成
        float angle = atan(z.y, z.x) / (2.0 * 3.14159265359) + 0.5; // -PIからPIを0-1に正規化
        color = palette(angle + u_time * 0.05, u_time); // 時間で色相を変化させる
    }

    gl_FragColor = vec4(color, 1.0);
}
