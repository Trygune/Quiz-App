let question_number = 1
class Question {
    constructor({
        number,
        answers,
        content,
        score,
        type
    }) {
        this.number = number
        this.answers = answers
        this.content = content
        this.score = score
        this.type = type
    }
}
const myquestions = [{
    number: 1,
    content: `What is Your number 1 Question?`,
    answers: [{
        one: true,
        two: false,
        three: false,
        four: false
    }],
    score: 1.5,
    type: 'radio'
}, {
    number: 2,
    content: `What is Your number 2 Question?`,
    answers: [{
        one: false,
        two: false,
        three: true,
        four: false
    }],
    score: 0.5,
    type: 'radio'
}, {
    number: 3,
    content: `What is Your number 3 Question?`,
    answers: [{
        one: false,
        two: true,
        three: false,
        four: true
    }],
    score: 0.5,
    type: 'check'
}, {
    number: 4,
    content: `What is Your number 4 Question?`,
    answers: [{
        one: false,
        two: true,
        three: false,
        four: false
    }],
    score: 0.5,
    type: 'radio'
}, {
    number: 5,
    content: `What is Your number 5 Question?`,
    answers: [{
        one: true,
        two: false,
        three: false,
        four: true
    }],
    score: 0.5,
    type: 'check'
}, {
    number: 6,
    content: `What is Your number 6 Question?`,
    answers: [{
        one: true,
        two: true,
        three: false,
        four: false
    }],
    score: 0.5,
    type: 'check'
}, {
    number: 7,
    content: `What is Your number 7 Question?`,
    answers: [{
        one: true,
        two: false,
        three: false,
        four: false
    }],
    score: 0.5,
    type: 'radio'
}, {
    number: 8,
    content: `What is Your number 8 Question?`,
    answers: [{
        one: false,
        two: true,
        three: false,
        four: true
    }],
    score: 1,
    type: 'check'
}, {
    number: 9,
    content: `What is Your number 9 Question?`,
    answers: [{
        one: true,
        two: true,
        three: true,
        four: true
    }],
    score: 0.25,
    type: 'check'
}, {
    number: 10,
    content: `What is Your number 10 Question?`,
    answers: [{
        one: false,
        two: true,
        three: true,
        four: false
    }],
    score: 1,
    type: 'check'
}, ]
const questions = myquestions.map(c => {
    return new Question({
        number: c.number,
        answers: c.answers,
        content: c.content,
        score: c.score,
        type: c.type
    })
})
class Quiz {
    constructor(question) {
        this.question = question
        this.total_score = 0
        this.pool = new Set()
        this.cont = true
        this.opts = ['one', 'two', 'three', 'four']
    }
    track = (event) => {
        this.pool.has(event.target.alt) ? this.pool.delete(event.target.alt) : this.pool.add(event.target.alt)
    }
    evalCheck = () => {
        this.pool.forEach(
            elm => {
                if (this.question[question_number - 1].answers[0][this.opts[elm]]) {
                    document.querySelectorAll('.option-label')[elm].classList.add('correct')
                    this.total_score += this.question[question_number - 1].score
                } else {
                    document.querySelectorAll('.option-label')[elm].classList.add('wrong')
                    this.total_score -= this.question[question_number - 1].score

                }
            })
    }
    evalRadio = (event) => {
        let oi = [1, 2, 3, 4]
        if (event.target.value === 'true') {
            if (event.target.id === 'number_1') {
                oi = oi.filter(item => item !== 1)
            } else if (event.target.id === 'number_2') {
                oi = oi.filter(item => item !== 2)
            } else if (event.target.id === 'number_3') {
                oi = oi.filter(item => item !== 3)
            } else if (event.target.id === 'number_4') {
                oi = oi.filter(item => item !== 4)
            }
            oi.forEach(i => {
                document.getElementById(`number_${i}`).classList.add('wrong')
            });
            document.getElementById(event.target.id).classList.add('correct')
            this.total_score += this.question[question_number - 1].score
            console.log(true);
        } else {
            document.getElementById(event.target.id).classList.add('wrong')
            console.log(false);
        }
        oi.forEach(i => {
            document.getElementById(`number_${i}`).disabled = true
        })
    }
}
class Action {
    constructor(
        quiz,
        myeval
    ) {
        this.quiz = quiz
        this.myeval = myeval
    }
    start_game = () => {
        document.getElementById('start-screen').classList.add('hide')
        document.getElementById('quiz-screen').classList.remove('hide')
        this.load_question()
        document.getElementsByClassName('controls')[0].classList.remove('hide')
    }
    load_question = () => {
        if (question_number < 11) {
            document.getElementById('question-text').innerText = this.quiz[(question_number) - 1].content
            document.getElementById('question-number').innerText = `Question ${question_number} of 10`
            document.getElementById('progress-fill').style.width = `${(question_number-1)*10}%`
            if (this.quiz[(question_number) - 1].type === 'radio') {
                this.load_answers_radio(this.quiz[(question_number) - 1].answers)
            } else {
                this.load_answers_check(this.quiz[(question_number) - 1].answers)
            }
        }
    }
    load_answers_radio = (ans) => {
        this.myeval.opts.forEach((item, index) => {
            document.getElementById(`number_${index+1}`).value = ans[0][item]
        })
        document.getElementById('answer-buttons-radio').classList.remove('hide')
        document.getElementById('answer-buttons-checkbox').classList.add('hide')
    }
    load_answers_check = (ans) => {
        this.myeval.opts.forEach((item, index) => {
            document.getElementById(`opt-${index+1}`).value = ans[0][item]
        })
        document.getElementById('answer-buttons-radio').classList.add('hide')
        document.getElementById('answer-buttons-checkbox').classList.remove('hide')
    }
    go_next = () => {
        question_number++
        if (this.quiz[question_number - 2].type === 'check') {
            question_number--
            this.myeval.evalCheck()
            question_number++
            setTimeout(() => {
                this.reset_ans()
                this.load_question()
                this.myeval.pool.clear()
            }, 500);
        } else {
            this.reset_ans()
            this.load_question()
            this.myeval.pool.clear()
        }
        if (question_number === 10) {
            document.getElementById('next-btn').innerText = 'Finish'
        }
        if (question_number > 10) {
            this.end_game()
        }
        this.myeval.cont = false
    }
    reset_ans = () => {
        for (let o = 1; o < 5; o++) {
            document.getElementById(`number_${o}`).classList.remove('correct')
            document.getElementById(`number_${o}`).classList.remove('wrong')
            document.getElementById(`number_${o}`).disabled = false
            document.querySelectorAll('.option-label')[o - 1].classList.remove('correct')
            document.querySelectorAll('.option-label')[o - 1].classList.remove('wrong')
            document.querySelectorAll('.hidden-input')[o - 1].checked = false
        }
    }
    end_game = () => {
        document.getElementById('score').innerText = this.myeval.total_score
        document.getElementById('quiz-screen').classList.add('hide')
        document.getElementById('result-screen').classList.remove('hide')
        document.getElementById('answer-buttons-radio').classList.add('hide')
        document.getElementsByClassName('controls')[0].classList.add('hide')
    }
    reloader = () => {
        location.reload()
    }
}
const myquiz = new Quiz(questions)
const app = new Action(questions, myquiz)