import {
  _decorator,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  Vec3,
} from "cc";
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
  private cubePrfb: Prefab | null = null;

  // Total road length
  @property
  private roadLength = 50;

  private road: BlockType[] = [];

  @property({ type: Node })
  private startMenu: Node | null = null;

  @property({ type: PlayerController })
  private playerCtrl: PlayerController | null = null;

  @property({ type: Label })
  private stepsLabel: Label | null = null;

  start() {
    this.curState = GameState.INIT;
    this.playerCtrl?.node.on("JumpEnd", this.onPlayerJumpEnd, this);
  }

  private init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }
    this.generateRoad();

    if (this.playerCtrl) {
      this.playerCtrl.setInputActive(false);
      this.playerCtrl.node.setPosition(Vec3.ZERO);
      this.playerCtrl.reset();
    }
  }

  private set curState(value: GameState) {
    switch (value) {
      case GameState.INIT:
        this.init();
        break;

      case GameState.PLAYING:
        if (this.startMenu) {
          this.startMenu.active = false;
        }

        if (this.stepsLabel) {
          this.stepsLabel.string = "0";
        }
        setTimeout(() => {
          this.playerCtrl?.setInputActive(true);
        }, 0.1);
        break;

      case GameState.END:
        break;
    }
  }

  private generateRoad() {
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

    let linkedBlocks = 0;
    for (let i = 0; i < this.road.length; ++i) {
      if (this.road[i] === BlockType.STONE) {
        ++linkedBlocks;
      } else {
        if (linkedBlocks > 0) {
          this.spawnBlockByCount(i - 1, linkedBlocks);
          linkedBlocks = 0;
        }
      }
    }
    if (linkedBlocks > 0) {
      this.spawnBlockByCount(this.road.length - 1, linkedBlocks);
      linkedBlocks = 0;
    }
  }

  private spawnBlockByCount(lastPos: number, count: number) {
    let block: Node | null = this.spawnBlockByType(BlockType.STONE);
    if (block) {
      this.node.addChild(block);
      block.setScale(count, 1, 1);
      block.setPosition(lastPos - (count - 1) * 0.5, -1.5, 0);
    }
  }

  private spawnBlockByType(type: BlockType) {
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

  onStartButtonClicked() {
    this.curState = GameState.PLAYING;
  }

  private onPlayerJumpEnd(moveIndex: number) {
    if (this.stepsLabel) {
      this.stepsLabel.string = "" + Math.min(moveIndex, this.roadLength);
    }

    if (
      moveIndex >= this.roadLength ||
      this.road[moveIndex] === BlockType.NONE
    ) {
      this.curState = GameState.INIT;
    }
  }
}
