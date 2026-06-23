const fs = require('fs');
const path = require('path');

const PRESERVED = [
  { tag: '问候', prompt: '早上见面，对方说的是：', heard: 'Good morning!', sub: '你应该怎么回答？', options: ['Good morning!', 'Good night!', 'Goodbye!', 'Sorry!'], answer: 0 },
  { tag: '感谢', prompt: '别人帮了你，你想表示感谢。最自然地说：', options: ['Thank you.', 'Goodbye.', 'Hello.', 'No.'], answer: 0 },
  { tag: '感谢', prompt: '对方说了这句话：', heard: 'Thank you!', sub: '你可以怎么回应？', options: ["You're welcome.", 'Sorry.', 'Hello.', 'Please.'], answer: 0 },
  { tag: '介绍', prompt: '第一次见面，想礼貌地打招呼：', options: ['Nice to meet you!', 'See you tomorrow!', 'Good night!', 'Excuse me?'], answer: 0 },
  { tag: '道别', prompt: '准备离开，向大家道别：', options: ['Goodbye!', 'Good morning!', 'How are you?', 'Thank you!'], answer: 0 },
  { tag: '问候', prompt: '想问对方「你好吗？」，最自然的英语说法是：', options: ['How are you?', 'What is it?', 'Where are you?', 'Who is it?'], answer: 0 },
  { tag: '问候', prompt: '对方问了你：', heard: 'How are you?', sub: '你怎么回答？', options: ["I'm fine, thank you!", 'Good night!', 'See you!', 'Nice to meet you!'], answer: 0 },
  { tag: '请求', prompt: '口渴了，想礼貌地要一杯水：', options: ['Can I have some water, please?', 'I am water.', 'Water is good.', 'Good morning!'], answer: 0 },
  { tag: '日常', prompt: '不小心碰到别人，应该马上说：', options: ['Sorry!', 'Thank you!', 'Hello!', 'Yes!'], answer: 0 },
  { tag: '游戏', prompt: '下课了，你跑到小伙伴跟前邀请他玩游戏，你说：', options: ["Let's play!", 'Good night!', 'I am tired.', 'See you!'], answer: 0 },
  { tag: '饮食', prompt: '走进餐厅坐下，服务员问你想吃什么，你想点米饭：', options: ["I'd like some rice, please.", 'I am rice.', 'Rice is red.', 'Goodbye!'], answer: 0 },
  { tag: '介绍', prompt: '对方问了你：', heard: "What's your name?", sub: '你怎么介绍自己？', options: ["My name is Ziang.", 'I am fine.', 'Thank you.', 'Good night!'], answer: 0 },
];

const NEW_ITEMS = [
  // 问候 (18)
  { tag: '问候', prompt: '下午在学校遇见同学，你想打招呼：', options: ['Good afternoon!', 'Good night!', 'Goodbye!', 'See you!'], answer: 0 },
  { tag: '问候', prompt: '晚上睡觉前跟爸爸妈妈说晚安：', options: ['Good night!', 'Good morning!', 'Good afternoon!', 'Hello!'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'Hello!', sub: '你怎么回应？', options: ['Hello!', 'Goodbye!', 'Sorry!', 'No.'], answer: 0 },
  { tag: '问候', prompt: '第一次见到新同学，简单打招呼：', options: ['Hi!', 'Bye!', 'No!', 'Sleep!'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'Hi!', sub: '你也打个招呼：', options: ['Hi!', 'Bye!', 'Sorry!', 'Help!'], answer: 0 },
  { tag: '问候', prompt: '放学回家路上，迎面遇见熟悉的邻居叔叔，你打招呼说：', options: ['Hello!', 'Good night!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'Good afternoon!', sub: '你怎么回答？', options: ['Good afternoon!', 'Good night!', 'Goodbye!', 'Sorry!'], answer: 0 },
  { tag: '问候', prompt: '体育课前遇到体育老师，想礼貌问好：', options: ['Hello, teacher!', 'Goodbye, teacher!', 'Sorry, teacher!', 'No, teacher!'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'How do you do?', sub: '正式场合你怎么回应？', options: ['How do you do?', 'I am fine.', 'Good night!', 'See you!'], answer: 0 },
  { tag: '问候', prompt: '很久没见的朋友迎面走来，你想问问他近况：', options: ['How are you?', 'What color?', 'How old?', 'Where book?'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: "I'm fine, thank you!", sub: '你也说说自己的情况：', options: ["I'm fine, too.", 'Good night!', 'Goodbye!', 'Sorry!'], answer: 0 },
  { tag: '问候', prompt: '课间遇到外国小朋友，想友好打招呼：', options: ['Nice to see you!', 'Go away!', 'I am angry.', 'Stop it!'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'Nice to see you!', sub: '你怎么回应？', options: ['Nice to see you, too!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '问候', prompt: '早读前想跟同桌说早上好：', options: ['Good morning!', 'Good night!', 'Goodbye!', 'Thank you!'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'Good evening!', sub: '晚上见面你怎么回答？', options: ['Good evening!', 'Good morning!', 'Goodbye!', 'Sorry!'], answer: 0 },
  { tag: '问候', prompt: '同桌今天看起来精神不太好，你想问问他今天过得怎么样：', options: ['How are you today?', 'What is today?', 'Where today?', 'Who today?'], answer: 0 },
  { tag: '问候', prompt: '对方说的是：', heard: 'Long time no see!', sub: '你怎么回应？', options: ['Long time no see!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '问候', prompt: '进教室时想跟全班问好：', options: ['Hello, everyone!', 'Goodbye, everyone!', 'Sorry, everyone!', 'No, everyone!'], answer: 0 },

  // 感谢 (12)
  { tag: '感谢', prompt: '同学借给你橡皮，你想谢谢他：', options: ['Thank you very much!', 'Goodbye!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '感谢', prompt: '对方说的是：', heard: 'Thank you so much!', sub: '你怎么回应？', options: ["You're welcome.", 'Sorry.', 'Goodbye.', 'Hello.'], answer: 0 },
  { tag: '感谢', prompt: '老师帮你捡起掉落的书，你想说：', options: ['Thank you, teacher!', 'Sorry, teacher!', 'Goodbye, teacher!', 'No, teacher!'], answer: 0 },
  { tag: '感谢', prompt: '妈妈给你做了早餐，你想感谢：', options: ['Thanks, Mom!', 'Sorry, Mom!', 'Goodbye, Mom!', 'No, Mom!'], answer: 0 },
  { tag: '感谢', prompt: '对方说的是：', heard: 'Thanks a lot!', sub: '你怎么回应？', options: ['No problem.', 'Sorry.', 'Goodbye.', 'Hello.'], answer: 0 },
  { tag: '感谢', prompt: '朋友送你生日礼物，你想说：', options: ['Thank you for the gift!', 'Sorry for the gift!', 'Goodbye for the gift!', 'No for the gift!'], answer: 0 },
  { tag: '感谢', prompt: '对方说的是：', heard: 'Thank you for your help!', sub: '你怎么回应？', options: ['My pleasure.', 'Sorry.', 'Goodbye.', 'Hello.'], answer: 0 },
  { tag: '感谢', prompt: '同学帮你解答了难题，你想说：', options: ['Thanks for your help!', 'Sorry for your help!', 'Goodbye for your help!', 'No for your help!'], answer: 0 },
  { tag: '感谢', prompt: '对方说的是：', heard: 'Thanks!', sub: '简短回应一下：', options: ["You're welcome.", 'Sorry.', 'Goodbye.', 'Please.'], answer: 0 },
  { tag: '感谢', prompt: '爸爸开车送你上学，下车时你想说：', options: ['Thank you, Dad!', 'Sorry, Dad!', 'Goodbye, Dad!', 'No, Dad!'], answer: 0 },
  { tag: '感谢', prompt: '对方说的是：', heard: 'Thank you for coming!', sub: '你怎么回应？', options: ['Glad to help.', 'Sorry.', 'Goodbye.', 'Hello.'], answer: 0 },
  { tag: '感谢', prompt: '护士阿姨给你打针很温柔，你想说：', options: ['Thank you, nurse!', 'Sorry, nurse!', 'Goodbye, nurse!', 'No, nurse!'], answer: 0 },

  // 学校 (30)
  { tag: '学校', prompt: '上课想举手回答问题，你会说：', options: ['May I answer?', 'I am answer.', 'Answer is good.', 'Good morning!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Open your books, please.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '上数学课要做练习，可铅笔不见了，你转头问同桌：', options: ['Do you have a pencil?', 'I am a pencil.', 'Pencil is red.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Sit down, please.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '终于把作业写完，举手告诉老师：', options: ['I finished my homework.', 'I am homework.', 'Homework is good.', 'Goodbye!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Stand up, please.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '要画直线但忘带尺子，你小声问同学：', options: ['Can I use your ruler?', 'I am your ruler.', 'Ruler is big.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Be quiet, please.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '老师讲得太快没听清，你举手问：', options: ['Pardon?', 'Goodbye!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Close your books.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '今天感冒不太舒服，体育课你跟老师说：', options: ["I'm not feeling well.", 'I am well.', 'Well is good.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Line up, please.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '值日时手里拎着垃圾袋，找不到垃圾桶，你问同学：', options: ['Where is the bin?', 'I am the bin.', 'Bin is good.', 'Good morning!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Hand in your homework.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '同学问下一节是什么课，你告诉他：', options: ["It's PE class.", 'I am PE.', 'PE is good.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Listen carefully.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '忘带课本了，想跟老师说：', options: ["I forgot my book.", 'I am my book.', 'Book is good.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Come here, please.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '英语课翻开书，你忘了上次学到哪，问同桌：', options: ['Which lesson is it?', 'I am lesson.', 'Lesson is good.', 'Good morning!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Read after me.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '课中急着去洗手间，你举手问老师：', options: ['May I go to the toilet?', 'I am toilet.', 'Toilet is good.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Work in pairs.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '考试开始前想确认时间：', options: ['How much time do we have?', 'I am time.', 'Time is good.', 'Good morning!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Stop talking.', sub: '你怎么回应？', options: ['Sorry.', 'Thank you.', 'Goodbye.', 'Hello.'], answer: 0 },
  { tag: '学校', prompt: '新同学问图书馆在哪，你告诉他：', options: ['The library is on the second floor.', 'I am library.', 'Library is good.', 'Good night!'], answer: 0 },
  { tag: '学校', prompt: '老师说的是：', heard: 'Take out your notebooks.', sub: '你怎么回应？', options: ['OK.', 'No.', 'Goodbye.', 'Sorry.'], answer: 0 },
  { tag: '学校', prompt: '美术课要涂色，你跟同桌借彩色笔：', options: ['Can I borrow your crayons?', 'I am crayons.', 'Crayons are good.', 'Good morning!'], answer: 0 },

  // 游戏 (18)
  { tag: '游戏', prompt: '下课操场上，你拿着绳子招呼同学一起跳：', options: ["Let's skip rope!", 'Good night!', 'I am tired.', 'See you!'], answer: 0 },
  { tag: '游戏', prompt: '对方说的是：', heard: "Let's play football!", sub: '你想加入，怎么说？', options: ["Great! Let's go!", 'No, goodbye.', 'I am football.', 'Good night!'], answer: 0 },
  { tag: '游戏', prompt: '捉迷藏时你找到了同学：', options: ['I found you!', 'I am you.', 'You are good.', 'Good morning!'], answer: 0 },
  { tag: '游戏', prompt: '到了同学家，你提议来玩捉迷藏：', options: ["Let's play hide and seek!", 'Good night!', 'I am hide.', 'Goodbye!'], answer: 0 },
  { tag: '游戏', prompt: '对方说的是：', heard: "Let's play tag!", sub: '你怎么回应？', options: ['OK! Run!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '游戏', prompt: '踢球时球踢飞了，你想说：', options: ['Go get the ball!', 'I am ball.', 'Ball is good.', 'Good morning!'], answer: 0 },
  { tag: '游戏', prompt: '看到朋友闲着，你想拉他一起搭积木：', options: ["Let's build blocks!", 'Good night!', 'I am blocks.', 'Goodbye!'], answer: 0 },
  { tag: '游戏', prompt: '对方说的是：', heard: "It's your turn.", sub: '轮到你玩了，你怎么说？', options: ['OK, my turn!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '游戏', prompt: '玩游戏赢了，想友好地说：', options: ['Good game!', 'Bad game!', 'I am game.', 'Good night!'], answer: 0 },
  { tag: '游戏', prompt: '看到棋盘摆好了，你叫同学过来下棋：', options: ["Let's play chess!", 'Good night!', 'I am chess.', 'Goodbye!'], answer: 0 },
  { tag: '游戏', prompt: '对方说的是：', heard: 'Can I join?', sub: '你想让他加入：', options: ['Sure! Come on!', 'No, go away.', 'I am join.', 'Good night!'], answer: 0 },
  { tag: '游戏', prompt: '滑梯上想提醒同学排队：', options: ['Please wait in line.', 'I am line.', 'Line is good.', 'Good morning!'], answer: 0 },
  { tag: '游戏', prompt: '草地很大风也大，你提议玩飞盘：', options: ["Let's play frisbee!", 'Good night!', 'I am frisbee.', 'Goodbye!'], answer: 0 },
  { tag: '游戏', prompt: '对方说的是：', heard: 'You win!', sub: '你怎么回应？', options: ['Thank you!', 'Sorry!', 'Goodbye!', 'No!'], answer: 0 },
  { tag: '游戏', prompt: '荡秋千时想提醒小心：', options: ['Be careful!', 'I am careful.', 'Careful is good.', 'Good morning!'], answer: 0 },
  { tag: '游戏', prompt: '拿出彩笔，你叫朋友一起画画：', options: ["Let's draw together!", 'Good night!', 'I am draw.', 'Goodbye!'], answer: 0 },

  // 饮食 (22)
  { tag: '饮食', prompt: '早餐想吃面包和牛奶：', options: ["I'd like bread and milk.", 'I am bread.', 'Bread is good.', 'Goodbye!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'What would you like?', sub: '你想点面条：', options: ["I'd like noodles, please.", 'I am noodles.', 'Noodles are red.', 'Goodbye!'], answer: 0 },
  { tag: '饮食', prompt: '午饭时想说「我不吃辣」：', options: ["I don't like spicy food.", 'I am spicy.', 'Spicy is good.', 'Good morning!'], answer: 0 },
  { tag: '饮食', prompt: '想礼貌地再要一个苹果：', options: ['Can I have another apple?', 'I am apple.', 'Apple is good.', 'Good night!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'Enjoy your meal!', sub: '你怎么回应？', options: ['Thank you!', 'Sorry!', 'Goodbye!', 'No!'], answer: 0 },
  { tag: '饮食', prompt: '走到学校食堂窗口，你想点一份沙拉：', options: ["I'd like a salad, please.", 'I am salad.', 'Salary is good.', 'Goodbye!'], answer: 0 },
  { tag: '饮食', prompt: '放学回家肚子咕咕叫，你告诉妈妈：', options: ["I'm hungry.", 'I am hungry.', 'Hungry is good.', 'Good morning!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'Are you hungry?', sub: '你确实饿了，怎么说？', options: ['Yes, I am.', 'No, goodbye.', 'I am fine.', 'Good night!'], answer: 0 },
  { tag: '饮食', prompt: '坐在快餐店里口很渴，你跟服务员点一杯橙汁：', options: ['Can I have orange juice?', 'I am orange.', 'Orange is good.', 'Goodbye!'], answer: 0 },
  { tag: '饮食', prompt: '饭后想说我吃饱了：', options: ["I'm full.", 'I am full.', 'Full is good.', 'Good morning!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'Do you want some cake?', sub: '你想要，怎么说？', options: ['Yes, please.', 'No, goodbye.', 'I am cake.', 'Good night!'], answer: 0 },
  { tag: '饮食', prompt: '坐在西餐厅，你看了菜单想点鸡肉：', options: ["I'd like chicken, please.", 'I am chicken.', 'Chicken is red.', 'Goodbye!'], answer: 0 },
  { tag: '饮食', prompt: '咬了一口蛋糕觉得很好吃，你告诉同学：', options: ["It's delicious!", 'I am delicious.', 'Delicious is good.', 'Good morning!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'Help yourself!', sub: '你怎么礼貌回应？', options: ['Thank you!', 'Sorry!', 'Goodbye!', 'No!'], answer: 0 },
  { tag: '饮食', prompt: 'Snack time 想吃饼干：', options: ['Can I have a cookie?', 'I am cookie.', 'Cookie is good.', 'Good night!'], answer: 0 },
  { tag: '饮食', prompt: '看到桌上一道没吃过的菜，你问服务员：', options: ['What is this dish?', 'I am dish.', 'Dish is good.', 'Good morning!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'Would you like some soup?', sub: '你不想要，礼貌拒绝：', options: ['No, thank you.', 'Yes, goodbye.', 'I am soup.', 'Good night!'], answer: 0 },
  { tag: '饮食', prompt: '早餐店里你想要一份鸡蛋：', options: ["I'd like an egg, please.", 'I am egg.', 'Egg is red.', 'Goodbye!'], answer: 0 },
  { tag: '饮食', prompt: '玩了一会儿口干舌燥，你跟朋友说：', options: ["I'm thirsty.", 'I am thirsty.', 'Thirsty is good.', 'Good morning!'], answer: 0 },
  { tag: '饮食', prompt: '对方说的是：', heard: 'Pass the salt, please.', sub: '你把盐递过去，说：', options: ['Here you are.', 'Goodbye.', 'Sorry.', 'No.'], answer: 0 },
  { tag: '饮食', prompt: '陪妈妈去水果店，你指着香蕉跟老板说：', options: ['I want some bananas.', 'I am bananas.', 'Bananas are good.', 'Good night!'], answer: 0 },

  // 请求 (22)
  { tag: '请求', prompt: '想请同学帮你开门：', options: ['Can you open the door?', 'I am door.', 'Door is good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'Can you help me?', sub: '你愿意帮忙：', options: ['Sure!', 'No, goodbye.', 'I am help.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '手工课你的胶棒用完了，跟同学借：', options: ['May I use your glue stick?', 'I am glue.', 'Glue is good.', 'Goodbye!'], answer: 0 },
  { tag: '请求', prompt: '想请老师再说一遍：', options: ['Could you say it again?', 'I am again.', 'Again is good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'May I come in?', sub: '你是班长，允许他进来：', options: ['Come in, please.', 'Go away.', 'I am come.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '想请妈妈帮你拿书包：', options: ['Can you get my bag?', 'I am bag.', 'Bag is good.', 'Goodbye!'], answer: 0 },
  { tag: '请求', prompt: '想请求去喝水：', options: ['May I get a drink?', 'I am drink.', 'Drink is good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'Can I sit here?', sub: '你同意：', options: ['Yes, please.', 'No, go away.', 'I am sit.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '想请同学小声一点：', options: ['Please be quiet.', 'I am quiet.', 'Quiet is good.', 'Goodbye!'], answer: 0 },
  { tag: '请求', prompt: '想请别人帮你捡笔：', options: ['Can you pick up my pen?', 'I am pen.', 'Pen is good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'Could you pass me the book?', sub: '你把书递过去：', options: ['Here you are.', 'Goodbye.', 'Sorry.', 'No.'], answer: 0 },
  { tag: '请求', prompt: '想请求用一下洗手间：', options: ['May I use the bathroom?', 'I am bathroom.', 'Bathroom is good.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '想请爸爸帮你修玩具：', options: ['Can you fix my toy?', 'I am toy.', 'Toy is good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'Can I borrow your eraser?', sub: '你同意借给他：', options: ['Sure, here you are.', 'No, go away.', 'I am eraser.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '想请同学和你一组：', options: ['Can we be partners?', 'I am partners.', 'Partners are good.', 'Goodbye!'], answer: 0 },
  { tag: '请求', prompt: '想请求再玩五分钟：', options: ['Can I play five more minutes?', 'I am minutes.', 'Minutes are good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'May I use your phone?', sub: '你不方便借：', options: ['Sorry, not now.', 'Yes, goodbye.', 'I am phone.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '想请老师看看你的画：', options: ['Can you look at my drawing?', 'I am drawing.', 'Drawing is good.', 'Goodbye!'], answer: 0 },
  { tag: '请求', prompt: '想请奶奶帮你系鞋带：', options: ['Can you tie my shoes?', 'I am shoes.', 'Shoes are good.', 'Good morning!'], answer: 0 },
  { tag: '请求', prompt: '对方说的是：', heard: 'Can you wait for me?', sub: '你愿意等：', options: ['Sure, I will wait.', 'No, goodbye.', 'I am wait.', 'Good night!'], answer: 0 },
  { tag: '请求', prompt: '想请店员拿小号的衣服：', options: ['Can I try size small?', 'I am small.', 'Small is good.', 'Goodbye!'], answer: 0 },
  { tag: '请求', prompt: '想请求打开窗户：', options: ['May I open the window?', 'I am window.', 'Window is good.', 'Good morning!'], answer: 0 },

  // 介绍 (18)
  { tag: '介绍', prompt: '新同学问你来自哪里，你告诉他你来自北京：', options: ["I'm from Beijing.", 'I am Beijing.', 'Beijing is good.', 'Good night!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'How old are you?', sub: '你八岁，怎么说？', options: ["I'm eight years old.", 'I am fine.', 'Good night.', 'Thank you.'], answer: 0 },
  { tag: '介绍', prompt: '朋友来你家，你指着妹妹给他介绍：', options: ['This is my sister.', 'I am sister.', 'Sister is good.', 'Good morning!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'Where are you from?', sub: '你来自上海：', options: ["I'm from Shanghai.", 'I am fine.', 'Good night.', 'Thank you.'], answer: 0 },
  { tag: '介绍', prompt: '夏令营里新认识的小朋友问你读几年级：', options: ["I'm in Grade One.", 'I am grade.', 'Grade is good.', 'Goodbye!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'Who is he?', sub: '他是你爸爸：', options: ["He's my dad.", 'I am dad.', 'Dad is good.', 'Good night!'], answer: 0 },
  { tag: '介绍', prompt: '宠物猫蹦到沙发上，你指给客人看：', options: ['This is my cat.', 'I am cat.', 'Cat is good.', 'Good morning!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'What class are you in?', sub: '你在二班：', options: ["I'm in Class Two.", 'I am fine.', 'Good night.', 'Thank you.'], answer: 0 },
  { tag: '介绍', prompt: '同学问你喜欢什么运动，你告诉他：', options: ['I like football.', 'I am football.', 'Football is good.', 'Goodbye!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'Is this your bag?', sub: '是的，是你的：', options: ['Yes, it is.', 'No, goodbye.', 'I am bag.', 'Good night!'], answer: 0 },
  { tag: '介绍', prompt: '在派对上你拉着 Lily 介绍给同桌：', options: ['This is my friend Lily.', 'I am Lily.', 'Lily is good.', 'Good morning!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'Do you have brothers?', sub: '有一个哥哥：', options: ['Yes, I have one brother.', 'No, goodbye.', 'I am brother.', 'Good night!'], answer: 0 },
  { tag: '介绍', prompt: '阿姨笑着问你今年几岁，你说：', options: ["I'm nine.", 'I am nine.', 'Nine is good.', 'Goodbye!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'What do you like?', sub: '你喜欢画画：', options: ['I like drawing.', 'I am drawing.', 'Drawing is good.', 'Good night!'], answer: 0 },
  { tag: '介绍', prompt: '家长开放日，你指着英语老师告诉爸爸：', options: ['She is my English teacher.', 'I am teacher.', 'Teacher is good.', 'Good morning!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'Nice to meet you!', sub: '你也礼貌回应：', options: ['Nice to meet you, too!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '介绍', prompt: '邻居小朋友问你住哪儿，你告诉他你就住附近：', options: ['I live near here.', 'I am near.', 'Near is good.', 'Goodbye!'], answer: 0 },
  { tag: '介绍', prompt: '对方说的是：', heard: 'Are you a student?', sub: '你是学生：', options: ['Yes, I am.', 'No, goodbye.', 'I am fine.', 'Good night!'], answer: 0 },

  // 道别 (12)
  { tag: '道别', prompt: '放学跟同学说回头见：', options: ['See you later!', 'Good morning!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '道别', prompt: '对方说的是：', heard: 'Goodbye!', sub: '你怎么回应？', options: ['Goodbye!', 'Good morning!', 'Sorry!', 'Thank you!'], answer: 0 },
  { tag: '道别', prompt: '明天还要见面，想说：', options: ['See you tomorrow!', 'Good night!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '道别', prompt: '对方说的是：', heard: 'See you!', sub: '你怎么回应？', options: ['See you!', 'Good morning!', 'Sorry!', 'Thank you!'], answer: 0 },
  { tag: '道别', prompt: '假期结束要回校，跟家人说：', options: ['Bye, see you after school!', 'Good morning!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '道别', prompt: '对方说的是：', heard: 'Have a nice day!', sub: '你怎么回应？', options: ['You too!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '道别', prompt: '电话结束想礼貌挂断：', options: ['Goodbye, talk to you later!', 'Hello again!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '道别', prompt: '对方说的是：', heard: 'See you next week!', sub: '你怎么回应？', options: ['See you next week!', 'Good morning!', 'Sorry!', 'Thank you!'], answer: 0 },
  { tag: '道别', prompt: '去同学家玩完要离开：', options: ['I have to go now. Bye!', 'Good morning!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '道别', prompt: '对方说的是：', heard: 'Take care!', sub: '你怎么回应？', options: ['You too!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '道别', prompt: '夏令营结束跟新朋友道别：', options: ['Keep in touch!', 'Good morning!', 'Thank you!', 'Sorry!'], answer: 0 },
  { tag: '道别', prompt: '对方说的是：', heard: 'Bye for now!', sub: '你怎么回应？', options: ['Bye!', 'Good morning!', 'Sorry!', 'Thank you!'], answer: 0 },

  // 情绪 (20)
  { tag: '情绪', prompt: '今天得了满分，你想说：', options: ["I'm so happy!", 'I am sad.', 'Sad is good.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm sad.", sub: '你想安慰他：', options: ["Don't worry.", 'Goodbye.', 'I am sad.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '跑完步很累，你想说：', options: ["I'm tired.", 'I am happy.', 'Happy is good.', 'Good morning!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm angry.", sub: '你想让他冷静：', options: ['Calm down, please.', 'Goodbye.', 'I am angry.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '收到惊喜礼物，你想说：', options: ["I'm excited!", 'I am bored.', 'Bored is good.', 'Goodbye!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm scared.", sub: '你想安慰：', options: ["It's OK.", 'Goodbye.', 'I am scared.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '考试没考好，你想说：', options: ["I'm a little sad.", 'I am happy.', 'Happy is good.', 'Good morning!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm bored.", sub: '你想提议一起玩：', options: ["Let's play a game!", 'Good night!', 'I am bored.', 'Goodbye!'], answer: 0 },
  { tag: '情绪', prompt: '天气太热，你想说：', options: ["It's so hot!", 'I am hot.', 'Hot is good.', 'Goodbye!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm cold.", sub: '你想建议穿外套：', options: ['Put on your coat.', 'Goodbye.', 'I am cold.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '看到可爱的小狗，你想说：', options: ["It's so cute!", 'I am cute.', 'Cute is good.', 'Good morning!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm worried.", sub: '你想安慰：', options: ["Don't worry.", 'Goodbye.', 'I am worried.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '外面下大雨，你想说：', options: ["It's rainy today.", 'I am rainy.', 'Rainy is good.', 'Goodbye!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm not feeling well.", sub: '你想建议休息：', options: ['You should rest.', 'Goodbye.', 'I am well.', 'Good night!'], answer: 0 },
  { tag: '情绪', prompt: '下雪了很开心，你想说：', options: ["I'm so happy! It's snowing!", 'I am snow.', 'Snow is good.', 'Good morning!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm surprised!", sub: '你也感到惊讶：', options: ['Me too!', 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '情绪', prompt: '等公交车等久了，你想说：', options: ["I'm bored.", 'I am happy.', 'Happy is good.', 'Goodbye!'], answer: 0 },
  { tag: '情绪', prompt: '对方说的是：', heard: "I'm proud of you!", sub: '你怎么回应？', options: ['Thank you!', 'Sorry!', 'Goodbye!', 'No!'], answer: 0 },
  { tag: '情绪', prompt: '外面风很大，你想说：', options: ["It's windy.", 'I am windy.', 'Windy is good.', 'Good morning!'], answer: 0 },

  // 日常 (16) — classroom objects, numbers, colors, time, sports, birthday, phone, shopping
  { tag: '日常', prompt: '美术课老师拿出一张卡片，你想问它是什么颜色：', options: ['What color is it?', 'I am color.', 'Color is good.', 'Good morning!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'What color is your bag?', sub: '你的包是蓝色的：', options: ["It's blue.", 'I am blue.', 'Blue is good.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '桌上一摞书摆得整整齐齐，你想数数有几本，问同学：', options: ['How many books are there?', 'I am books.', 'Books are good.', 'Goodbye!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'How many apples?', sub: '有三个：', options: ['Three.', 'I am three.', 'Three is good.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '出门时没看表，你问爸爸现在几点：', options: ['What time is it?', 'I am time.', 'Time is good.', 'Good morning!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: "It's three o'clock.", sub: '该去上课了，你说：', options: ["It's time for class.", 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '日常', prompt: '看上文具店一支笔，想问店员价钱：', options: ['How much is it?', 'I am much.', 'Much is good.', 'Goodbye!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: "It's five yuan.", sub: '你想买：', options: ["I'll take it.", 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '日常', prompt: '接电话时第一句话：', options: ['Hello?', 'Goodbye!', 'Sorry!', 'Thank you!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'Is Tom there?', sub: '他不在，你说：', options: ["He's not here.", 'I am Tom.', 'Tom is good.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '同学生日，你想说：', options: ['Happy birthday!', 'Good night!', 'Sorry!', 'Thank you!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'Happy birthday!', sub: '你怎么回应？', options: ['Thank you!', 'Sorry!', 'Goodbye!', 'No!'], answer: 0 },
  { tag: '日常', prompt: '体育课想说自己会游泳：', options: ['I can swim.', 'I am swim.', 'Swim is good.', 'Good morning!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'Can you run fast?', sub: '你可以：', options: ['Yes, I can.', 'No, goodbye.', 'I am run.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '找不到橡皮，你想说：', options: ['Where is my eraser?', 'I am eraser.', 'Eraser is good.', 'Goodbye!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'Where is the library?', sub: '在一楼：', options: ["It's on the first floor.", 'I am library.', 'Library is good.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '一早进教室，你告诉同学今天是星期一：', options: ["It's Monday.", 'I am Monday.', 'Monday is good.', 'Good morning!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'What day is today?', sub: '今天是星期五：', options: ["It's Friday.", 'I am Friday.', 'Friday is good.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '天黑了，想开灯：', options: ['Turn on the light, please.', 'I am light.', 'Light is good.', 'Goodbye!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'Look at the sky!', sub: '今天天气晴朗：', options: ["It's sunny.", 'I am sunny.', 'Sunny is good.', 'Good night!'], answer: 0 },
  { tag: '日常', prompt: '走到路口要过马路，你提醒妹妹：', options: ['Look both ways.', 'I am ways.', 'Ways are good.', 'Good morning!'], answer: 0 },
  { tag: '日常', prompt: '对方说的是：', heard: 'The light is green.', sub: '可以走了：', options: ["Let's go.", 'Good night!', 'Sorry!', 'No!'], answer: 0 },
  { tag: '日常', prompt: '妈妈打电话问你在哪儿，你回答：', options: ["I'm at school.", 'I am school.', 'School is good.', 'Goodbye!'], answer: 0 },
];

const ANSWER_ROTATION = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0];

function rotateAnswer(item, targetAnswer) {
  const correct = item.options[item.answer];
  const wrong = item.options.filter((_, i) => i !== item.answer);
  const newOptions = [...wrong];
  newOptions.splice(targetAnswer, 0, correct);
  return { ...item, options: newOptions, answer: targetAnswer };
}

function optionsKey(options) {
  return [...options].sort().join('\0');
}

const DISTRACTOR_VARIANTS = [
  'Not now.', 'Maybe later.', 'I think not.', 'Hmm, no.',
  'Not really.', 'Perhaps not.', 'Wait a minute.', 'Hold on.',
  'No way.', 'Not yet.', 'Later.', 'Skip it.',
];

function uniquifyOptions(items) {
  const seen = new Set();
  return items.map((item) => {
    let options = [...item.options];
    let answer = item.answer;
    let variantIdx = 0;
    let key = optionsKey(options);
    while (seen.has(key)) {
      const wrongIndices = options.map((_, i) => i).filter((i) => i !== answer);
      const swapIdx = wrongIndices[variantIdx % wrongIndices.length];
      options[swapIdx] = DISTRACTOR_VARIANTS[variantIdx % DISTRACTOR_VARIANTS.length];
      key = optionsKey(options);
      variantIdx += 1;
    }
    seen.add(key);
    return { ...item, options, answer };
  });
}

function validateItem(item, id) {
  const correct = item.options[item.answer];
  const chinese = [item.prompt, item.sub].filter(Boolean).join(' ');
  if (chinese.includes(correct)) {
    throw new Error(`${id}: correct answer "${correct}" leaked in prompt/sub`);
  }
}

if (PRESERVED.length !== 12) {
  throw new Error(`Expected 12 preserved items, got ${PRESERVED.length}`);
}
if (NEW_ITEMS.length !== 188) {
  throw new Error(`Expected 188 new items, got ${NEW_ITEMS.length}`);
}

// Rotate answers for preserved items (vary from all-0)
PRESERVED.forEach((item, i) => {
  const target = ANSWER_ROTATION[i % ANSWER_ROTATION.length];
  if (target !== item.answer) {
    Object.assign(item, rotateAnswer(item, target));
  }
});

// Rotate answers for new items
NEW_ITEMS.forEach((item, i) => {
  const target = ANSWER_ROTATION[(i + 12) % ANSWER_ROTATION.length];
  if (target !== item.answer) {
    Object.assign(item, rotateAnswer(item, target));
  }
});

const allItems = uniquifyOptions([...PRESERVED, ...NEW_ITEMS]);

if (allItems.length !== 200) {
  throw new Error(`Expected 200 items, got ${allItems.length}`);
}

const data = allItems.map((item, i) => {
  const id = `e${i + 1}`;
  validateItem(item, id);
  const entry = {
    id,
    tag: item.tag,
    prompt: item.prompt,
    options: item.options,
    answer: item.answer,
  };
  if (item.heard) entry.heard = item.heard;
  if (item.sub) entry.sub = item.sub;
  return entry;
});

const outPath = path.join(__dirname, '..', 'english.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');

const counts = data.reduce((acc, item) => {
  acc[item.tag] = (acc[item.tag] || 0) + 1;
  return acc;
}, {});

console.log(`Wrote ${data.length} items to ${outPath}`);
console.log('Counts by tag:', counts);
