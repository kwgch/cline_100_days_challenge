// js/commands/Command.js
class Command {
  constructor() {
    this.previousState = null;
  }
  
  execute(canvas) {
    // 実行前の状態を保存
    this.previousState = canvas.getImageData();
    // サブクラスで実装
  }
  
  undo(canvas) {
    if (this.previousState) {
      canvas.putImageData(this.previousState);
    }
  }
}

export default Command;
