export interface Question {
    title: string;
    options: {
        text: string;
        score: number;
    }[];
}

export const QUESTIONS: Question[] = [
    {
        title: '猫咪半夜跑酷，你会？',
        options: [
            { text: '忍了，它开心就好', score: 3 },
        ]
    },
    {
        title: '猫咪半夜跑酷，你会？',
        options: [
            { text: '忍了，它开心就好', score: 3 },
            { text: '轻声制止', score: 2 },
            { text: '轻声制止', score: 2 },
            { text: '崩溃睡不着', score: 1 }
        ]
    },
    {
        title: '猫咪半夜跑酷，你会？',
        options: [
            { text: '忍了，它开心就好', score: 3 },
            { text: '轻声制止', score: 2 },
            { text: '崩溃睡不着', score: 1 }
        ]
    },
    {
        title: '猫抓沙发你会？',
        options: [
            { text: '买新沙发', score: 3 },
            { text: '想送人', score: 1 }
        ]
    }
];
