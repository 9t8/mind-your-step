import {
  _decorator,
  Component,
  EventMouse,
  Input,
  input,
  Node,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  // Whether to receive the jump command
  private startJump = false;

  // The jump step count
  private jumpStep = 0;

  // Current jump time
  private curJumpTime: number;

  // Total jump time
  private jumpTime: number;

  // current jump speed
  private curJumpSpeed: number;

  // Current position of the character
  private curPos = new Vec3();

  // The difference of the current frame movement position during each jump
  private deltaPos = new Vec3(0, 0, 0);

  // The target position of the character
  private targetPos = new Vec3();

  start() {
    input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
  }

  onMouseUp(event: EventMouse) {
    if (event.getButton() === 0) {
    } else if (event.getButton() === 2) {
    }
  }

  jumpByStep(step: number) {
    if (this.startJump) {
      return;
    }
    this.startJump = true;
    this.jumpStep = step;
    this.curJumpTime = 0;
    this.curJumpSpeed = this.jumpStep / this.jumpTime;
    this.node.getPosition(this.curPos);
    Vec3.add(this.targetPos, this.curPos, new Vec3(this.jumpStep, 0, 0));
  }

  update(deltaTime: number) {
    if (this.startJump) {
      this.curJumpTime += deltaTime;
      if (this.curJumpTime > this.jumpTime) {
        // Jump ends
        this.node.setPosition(this.targetPos);
        this.startJump = false;
      } else {
        // Jumping
        this.node.getPosition(this.curPos);
        this.deltaPos.x = this.curJumpSpeed * deltaTime;
        Vec3.add(this.curPos, this.curPos, this.deltaPos);
        this.node.setPosition(this.curPos);
      }
    }
  }
}
