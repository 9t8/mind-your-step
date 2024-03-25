import {
  _decorator,
  Animation,
  Component,
  EventMouse,
  Input,
  input,
  SkeletalAnimation,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property({ type: Animation })
  public BodyAnim: Animation | null = null;

  @property({ type: SkeletalAnimation })
  public CocosAnim: SkeletalAnimation | null = null;

  // Whether to receive the jump command
  private startJump = false;

  // The jump step count
  private jumpStep = 0;

  // Current jump time
  private curJumpTime = 0;

  // Total jump time
  private jumpTime = 0.1;

  // current jump speed
  private curJumpSpeed = 0;

  // Current position of the character
  private curPos = new Vec3();

  // The difference of the current frame movement position during each jump
  private deltaPos = new Vec3(0, 0, 0);

  // The target position of the character
  private targetPos = new Vec3();

  private curMoveIndex = 0;

  setInputActive(active: boolean) {
    if (active) {
      input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    } else {
      input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
  }

  onMouseUp(event: EventMouse) {
    if (event.getButton() === 0) {
      this.jumpByStep(1);
    } else if (event.getButton() === 2) {
      this.jumpByStep(2);
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

    if (this.CocosAnim) {
      var state = this.CocosAnim.getState("cocos_anim_jump");
      state.speed = state.duration / this.jumpTime;
      this.CocosAnim.play("cocos_anim_jump");
    }

    // if (this.BodyAnim) {
    //   if (step === 1) {
    //     this.BodyAnim.play("oneStep");
    //   } else if (step === 2) {
    //     this.BodyAnim.play("twoStep");
    //   }
    // }

    this.curMoveIndex += step;
  }

  update(deltaTime: number) {
    if (this.startJump) {
      this.curJumpTime += deltaTime;
      if (this.curJumpTime > this.jumpTime) {
        // Jump ends
        this.node.setPosition(this.targetPos);
        this.startJump = false;
        this.onOnceJumpEnd();
      } else {
        // Jumping
        this.node.getPosition(this.curPos);
        this.deltaPos.x = this.curJumpSpeed * deltaTime;
        Vec3.add(this.curPos, this.curPos, this.deltaPos);
        this.node.setPosition(this.curPos);
      }
    }
  }

  onOnceJumpEnd() {
    if (this.CocosAnim) {
      this.CocosAnim.play("cocos_anim_idle");
    }
    this.node.emit("JumpEnd", this.curMoveIndex);
  }

  reset() {
    this.curMoveIndex = 0;
  }
}
