import { _decorator, Component, Label, Node } from 'cc';
import { QUESTIONS, Question } from './test_data';
import { GameRoot } from '../../core/ui/GameRoot';
const { ccclass, property } = _decorator;

@ccclass('test_main')
export class test_main extends GameRoot {

    @property(Node) lab_title: Node = null!;

    @property(Node) startPanel: Node = null!;
    @property(Node) questionPanel: Node = null!;
    @property(Node) resultPanel: Node = null!;

    @property(Label) questionLabel: Label = null!;
    @property(Label) progressLabel: Label = null!;
    @property(Label) optionLabels: Label[] = [];

    @property(Label) resultTitle: Label = null!;
    @property(Label) resultDesc: Label = null!;

    private index = 0;
    private score = 0;

    start() {
        this.showStart();
    }

    showStart() {
        this.startPanel.active = true;
        this.questionPanel.active = false;
        this.resultPanel.active = false;
    }

    startTest() {
        this.index = 0;
        this.score = 0;
        this.showQuestion();
    }

    showQuestion() {
        const q = QUESTIONS[this.index];
        this.startPanel.active = false;
        this.questionPanel.active = true;
        this.resultPanel.active = false;

        this.questionLabel.string = q.title;
        this.progressLabel.string = `${this.index + 1}/${QUESTIONS.length}`;

        q.options.forEach((opt, i) => {
            this.optionLabels[i].string = opt.text;
        });
    }

    chooseOption(event: Event, idx: string) {
        const optionIndex = Number(idx);
        const q = QUESTIONS[this.index];

        this.score += q.options[optionIndex].score;
        this.index++;

        if (this.index >= QUESTIONS.length) {
            this.showResult();
        } else {
            this.showQuestion();
        }
    }

    showResult() {
        this.startPanel.active = false;
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
