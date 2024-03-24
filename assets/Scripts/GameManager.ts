import { _decorator, Component, instantiate, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

// Track grid type, pit (NONE) or solid road (STONE)
enum BlockType {
  NONE,
  STONE,
}

@ccclass("GameManager")
export class GameManager extends Component {
  // The runway prefab
  @property({ type: Prefab })
  public cubePrfb: Prefab | null = null;

  // Total road length
  @property
  public roadLength = 50;

  private road: BlockType[] = [];

  start() {
    this.generateRoad();
  }

  generateRoad() {
    this.node.removeAllChildren();
    this.road = [];
    this.road.push(BlockType.STONE);

    for (let i = 1; i < this.roadLength; ++i) {
      if (this.road[i - 1] === BlockType.NONE) {
        this.road.push(BlockType.STONE);
      } else {
        this.road.push(Math.floor(Math.random() * 2));
      }
    }

    for (let i = 0; i < this.road.length; ++i) {
      let block = this.spawnBlockByType(this.road[i]);
      if (block) {
        this.node.addChild(block);
        block.setPosition(i, -1.5, 0);
      }
    }
  }

  spawnBlockByType(type: BlockType) {
    if (!this.cubePrfb) {
      return null;
    }

    let block: Node | null = null;
    switch (type) {
      case BlockType.STONE:
        block = instantiate(this.cubePrfb);
        break;
    }

    return block;
  }

  update(deltaTime: number) {}
}
