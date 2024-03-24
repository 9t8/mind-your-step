import { _decorator, Component, Node, Prefab } from "cc";
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

  generateRoad() {}

  update(deltaTime: number) {}
}
