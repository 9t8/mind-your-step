import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from "cc";
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;

// Track grid type, pit (NONE) or solid road (STONE)
enum BlockType {
  NONE,
  STONE,
}

enum GameState {
  INIT,
  PLAYING,
  END,
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

  @property({ type: PlayerController })
  public playerCtrl: PlayerController | null = null;

  @property({ type: Node })
  public startMenu: Node | null = null;

  start() {
    this.curState = GameState.INIT;
    this.playerCtrl?.node.on("JumpEnd", this.onPlayerJumpEnd, this);
  }

  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }
    this.generateRoad();
    if (this.playerCtrl) {
      this.playerCtrl.setInputActive(false);
      this.playerCtrl.node.setPosition(Vec3.ZERO);
    }
    this.playerCtrl.reset(); // FIXME
  }

  set curState(value: GameState) {
    switch (value) {
      case GameState.INIT:
        this.init();
        break;

      case GameState.PLAYING:
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        setTimeout(() => {
          if (this.playerCtrl) {
            this.playerCtrl.setInputActive(true);
          }
        }, 0.1);
        break;

      case GameState.END:
        break;
    }
  }

  onStartButtonClicked() {
    this.curState = GameState.PLAYING;
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

  checkResult(moveIndex: number) {
    if (moveIndex < this.roadLength) {
      // Jumped on the pit
      if (this.road[moveIndex] === BlockType.NONE) {
        this.curState = GameState.INIT;
      }
    } else {
      // Skipped maximum length
      this.curState = GameState.INIT;
    }
  }

  onPlayerJumpEnd(moveIndex: number) {
    this.checkResult(moveIndex);
  }
}
