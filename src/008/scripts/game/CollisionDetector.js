class CollisionDetector {
  constructor() {
  }

  detectCollision(entity1, entity2) {
    if (entity1.x < entity2.x + entity2.width &&
      entity1.x + entity1.width > entity2.x &&
      entity1.y < entity2.y + entity2.height &&
      entity1.y + entity1.height > entity2.y) {
      return true;
    }
    return false;
  }
}

export default CollisionDetector;
