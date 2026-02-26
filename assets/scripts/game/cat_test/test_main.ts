import { _decorator, ProgressBar, Label, Node } from 'cc';
import { QUESTIONS, Question } from './test_data';
import { GameRoot } from '../../core/ui/GameRoot';
import { Button } from 'cc';
import { color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('test_main')
export class test_main extends GameRoot {

    @property(Label) lab_title: Label = null!;
    @property(Label) lab_count: Label = null!;
    @property(Node) progress: Node = null!;

    @property(Label) lab_question: Label = null!;
    @property(Node) tb_option: Node[] = [];

    @property(Node) btn_last: Node = null!;
    @property(Node) btn_next: Node = null!;
    @property(Node) btn_res: Node = null!;

    @property(Node) questionPanel: Node = null!;
    @property(Node) resultPanel: Node = null!;

    @property(Label) resultTitle: Label = null!;
    @property(Label) resultDesc: Label = null!;

    private index = 0;
    private score = 0;

    private answers: number[] = [];

    start() {
        this.start_test()
    }

    start_test() {
        this.index = 0;
        this.score = 0;
        this.answers = [];
        this.questionPanel.active = true;
        this.resultPanel.active = false;
        this.btn_res.active = false;
        this.show_question();
    }

    show_question() {
        this.lab_count.string = `共 ${QUESTIONS.length} 题，已完成 ${this.index} 题`;
        this.progress.getComponent(ProgressBar).progress = this.index / QUESTIONS.length

        const question_config = QUESTIONS[this.index];
        this.lab_question.string = `${this.index + 1}. ` + question_config.title;

        let tb_str = ["A.", "B.", "C.", "D."]
        let options = question_config.options
        for (let index = 0; index < this.tb_option.length; index++) {
            const option = this.tb_option[index];
            if (index < options.length){
                option.active = true
                let lab = option.getChildByName("option_btn").getChildByName("lab_text").getComponent(Label)
                lab.string = tb_str[index] + options[index].text

                lab.color = color(0, 0, 0)
                if (typeof this.answers[this.index] === "number" && index == this.answers[this.index]){
                    lab.color = color(0,255,0)
                }
            } else{
                option.active = false
            }
        }

        this.btn_last.getComponent(Button).interactable = this.index > 0
        this.btn_last.getChildByName("lab_text").getComponent(Label).color = this.index > 0 ? color(0, 0, 0) : color(125, 125, 125)

        this.btn_next.getComponent(Button).interactable = false
        this.btn_next.getChildByName("lab_text").getComponent(Label).color = color(125, 125, 125)
        if (this.index + 1 < QUESTIONS.length && this.answers[this.index] !== undefined) {
            this.btn_next.getComponent(Button).interactable = true
            this.btn_next.getChildByName("lab_text").getComponent(Label).color = color(0, 0, 0)
        }
    }

    choose_option(event: Event, idx: string) {
        const option_index = Number(idx);
        const q = QUESTIONS[this.index];

        this.answers[this.index] = option_index

        this.score += q.options[option_index].score;
        this.index++;

        if (this.index >= QUESTIONS.length) {
            this.index = QUESTIONS.length - 1
        } else {
            this.show_question();
        }

        if(this.is_compile_all()){
            this.btn_res.active = true;
        }
    }

    is_compile_all(){
        for (let index = 0; index < QUESTIONS.length; index++) {
            if (typeof this.answers[index] != "number") {
                return false
            }
        }
        return true
    }

    on_click_close(){
        this.hide_myself()
    }

    // 上一题
    on_click_last(){
        if (this.index <= 0) return;
        this.index--;
        this.show_question();
    }

    // 下一题
    on_click_next(){
        if (this.index >= QUESTIONS.length - 1) {
            return;
        }
        this.index++;
        this.show_question();
    }

    //////////////////////////// 测试结果逻辑 ////////////////////////////
    on_click_res(){
        // mius.gui.show_toast("请完成所有题目")
        if (this.is_compile_all()){
            this.show_result();
        }else{
            // mius.gui.show_toast("请完成所有题目")
        }
    }

    calc_result() {
        let totalScore = 0;
        this.answers.forEach((optIdx, qIdx) => {
            const score = QUESTIONS[qIdx].options[optIdx].score;
            totalScore += score;
        });

        console.log('最终得分：', totalScore);
        // TODO：跳转结果页
    }

    show_result() {
        this.questionPanel.active = false;
        this.resultPanel.active = true;

        if (this.score >= 8) {
            this.resultTitle.string = '资深铲屎官 🐾';
            this.resultDesc.string = '猫是主子，你是工具人。';
        } else if (this.score >= 5) {
            this.resultTitle.string = '合格养猫人';
            this.resultDesc.string = '你和猫和平共处。';
        } else {
            this.resultTitle.string = '云养猫选手';
            this.resultDesc.string = '你可能更适合看视频。';
        }
    }
}