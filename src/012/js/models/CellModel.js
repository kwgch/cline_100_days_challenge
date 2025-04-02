class CellModel {
    constructor(value = 0, isGiven = false) {
        this.value = value; // セルの値（0は空）
        this.isGiven = isGiven; // 初期値かどうか
        this.notes = new Set(); // メモ用の候補数字
    }

    setValue(value) {
        this.value = value;
    }

    toggleNote(num) {
        if (this.notes.has(num)) {
            this.notes.delete(num);
        } else {
            this.notes.add(num);
        }
    }

    clear() {
        this.value = 0;
        this.notes.clear();
    }
}

export { CellModel };
