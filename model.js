window.tffo = window.tffo || {};

$.extend(tffo, {
	HOME: 'home',
	READY: 'ready',
	QUESTION: 'question',
	RIGHT: 'right',
	WRONG: 'wrong',
	GAME_OVER: 'game_over'
});

$(document).ready(function() {
	var Question = function(question, answer) {
		this.question = question;
		this.answer = answer;
	};

	var Answer = function(vm, typeface) {
		this.vm = vm;
		this.typeface = typeface;

		this.click = function() {
			this.vm.answerClicked(this);
		};
	};

	var ViewModel = function() {
		this.font1 = ko.observable('Arial');
		this.font2 = ko.observable('Verdana');
		this.score = ko.observable();
		this.questionScore = ko.observable();
		this.lives = ko.observable();
		this.state = ko.observable(tffo.HOME);
		this.showHeader = ko.computed(function() {
			return this.state() != tffo.HOME && this.state() != tffo.GAME_OVER;
		}, this);
		this.question = ko.observable(new Question("", new Answer()));
		this.answers = ko.observableArray();

		this.newGame = function() {
			this.lives(3);
			this.score(0);
			this.state(tffo.READY);
		};

		this.play = function() {
			var typefaces = [this.font1(), this.font2()].sort();
			var vm = this;
			var answers = $.map(typefaces, function(typeface) { return new Answer(vm, typeface); })
			this.answers(answers);
			this.nextQuestion();
		};

		this.answerClicked = function(answer) {
			$('div#timer_bar').stop();

			if (this.question().answer == answer) {
				this.rightAnswer();
			} else {
				this.wrongAnswer();
			}
		};

		this.rightAnswer = function() {
			this.scoreThisQuestion();
			this.score(this.score() + this.questionScore());
			this.state(tffo.RIGHT);
		};

		this.wrongAnswer = function() {
			this.lives(this.lives() - 1);
			if (this.lives()) {
				this.state(tffo.WRONG);
			} else {
				this.state(tffo.GAME_OVER);
			}
		};

		this.scoreThisQuestion = function() {
			if (this.timerProgress < 33) {
				this.questionScore(100);
			} else if (this.timerProgress < 66) {
				this.questionScore(50);
			} else {
				this.questionScore(25);
			}
		}

		this.nextQuestion = function() {
			var phrase = this.randomChoice(tffo.phrases);
			var answer = this.randomChoice(this.answers());
			this.question(new Question(phrase, answer));
			this.animateTimerBar();
			this.state(tffo.QUESTION);
		};

		this.animateTimerBar = function() {
			$('div#timer_bar').width(0)
				.animate({ width: '100%'}, {
					duration: 5000,
					easing: 'linear',
					step: $.proxy(this.onTimerStep, this),
					complete: $.proxy(this.onTimerFinished, this)
				});
		};

		this.onTimerStep = function(progress) {
			this.timerProgress = progress;
		};

		this.onTimerFinished = function() {
			if (this.state() == tffo.QUESTION) {
				this.wrongAnswer();
			}
		}

		this.randomChoice = function(arr) {
			var i = Math.floor(Math.random() * arr.length);
			return arr[i];
		};

		this.home = function() {
			this.state(tffo.HOME);
		};
	};

	ko.applyBindings(new ViewModel());
});
