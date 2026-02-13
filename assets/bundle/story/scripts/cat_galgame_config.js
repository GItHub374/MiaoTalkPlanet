[
  { "cmd": "bg", "name": "school_gate_day" },
  { "cmd": "bgm", "name": "light_theme" },

  {
    "cmd": "say",
    "name": "旁白",
    "text": "放学后的天空阴沉沉的，空气里弥漫着即将下雨的味道。"
  },

  {
    "cmd": "say",
    "name": "我",
    "text": "今天好像要下雨……忘记带伞了。"
  },

  {
    "cmd": "show",
    "char": "xiaoxue",
    "face": "smile",
    "pos": "right"
  },

  {
    "cmd": "say",
    "name": "小雪",
    "text": "诶？你也没带伞吗？"
  },

  {
    "cmd": "choice",
    "options": [
      { "text": "主动提出一起走", "jump": "invite", "condition": "" },
      { "text": "有些害羞地沉默", "jump": "silent", "condition": "" }
    ]
  },

  { "label": "invite" },

  {
    "cmd": "set",
    "set": { "like": 1 }
  },

  {
    "cmd": "say",
    "name": "我",
    "text": "要不……一起走吧？我可以送你回家。"
  },

  {
    "cmd": "say",
    "name": "小雪",
    "text": "诶？那、那就麻烦你啦。"
  },

  { "cmd": "jump", "jump": "walk_home" },

  { "label": "silent" },

  {
    "cmd": "set",
    "set": { "like": 0 }
  },

  {
    "cmd": "say",
    "name": "我",
    "text": "……"
  },

  {
    "cmd": "say",
    "name": "小雪",
    "text": "那我先走了哦。"
  },

  { "cmd": "jump", "jump": "walk_home" },

  { "label": "walk_home" },

  { "cmd": "bg", "name": "street_rain" },

  {
    "cmd": "say",
    "name": "旁白",
    "text": "雨还是落了下来。"
  },

  {
    "cmd": "say",
    "name": "小雪",
    "text": "其实……我一直很期待能和你一起回家。"
  },

  {
    "cmd": "choice",
    "options": [
      { "text": "握住她的手", "jump": "hold_hand" },
      { "text": "假装没听见", "jump": "ignore" }
    ]
  },

  { "label": "hold_hand" },

  {
    "cmd": "set",
    "set": { "like": 2 }
  },

  {
    "cmd": "say",
    "name": "我",
    "text": "那以后，每天都一起走吧。"
  },

  { "cmd": "jump", "jump": "ending_check" },

  { "label": "ignore" },

  {
    "cmd": "say",
    "name": "我",
    "text": "雨下得有点大呢。"
  },

  { "cmd": "jump", "jump": "ending_check" },

  { "label": "ending_check" },

  {
    "cmd": "say",
    "name": "旁白",
    "text": "心跳声在雨声中显得格外清晰。"
  },

  {
    "cmd": "jump",
    "jump": "good_ending",
    "if": "like >= 2"
  },

  { "cmd": "jump", "jump": "normal_ending" },

  { "label": "good_ending" },

  { "cmd": "bgm", "name": "romantic_theme" },

  {
    "cmd": "say",
    "name": "小雪",
    "text": "那……说好了哦。"
  },

  {
    "cmd": "say",
    "name": "旁白",
    "text": "那天的雨，成了我们故事的开始。"
  },

  {
    "cmd": "say",
    "name": "系统",
    "text": "【Good Ending】雨后的约定"
  },

  { "cmd": "jump", "jump": "the_end" },

  { "label": "normal_ending" },

  {
    "cmd": "say",
    "name": "旁白",
    "text": "或许有些话，如果当时说出口，结局会不一样。"
  },

  {
    "cmd": "say",
    "name": "系统",
    "text": "【Normal Ending】擦肩而过"
  },

  { "label": "the_end" }
]
