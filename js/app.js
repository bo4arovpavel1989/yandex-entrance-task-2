(function(){
	class Scroller {
		constructor(selector, rows, blockWidth, margin){
			this.selector = selector;
			this.blockWidth = blockWidth;
			this.rows = rows;
			this.margin = margin;
			this.isOverflow;
			this.isListenerForward = false; //check if is listener of forward arrow
			this.isListenerBack = false; //check if is listener of back arrow
			
			this.listenToScreenChange();
			this.listenToOverflow();
		}
		
		listenToOverflow(){
			let totalWidth = document.getElementById(this.selector).offsetWidth;
			let children = document.querySelectorAll(`.${this.selector}-children`);
			
			let sum = 0;
			
			children.forEach(child => {
				sum += child.offsetWidth + this.margin;
			})
			
			this.isOverflow = (totalWidth < (sum / this.rows))
		
			if (totalWidth < (sum / this.rows)) {
				this.handleOverflow();
				this.handleScrollForward();
			} else {
				this.handleUnderflow();
			}	
		}
		
		listenToScreenChange(){
			window.addEventListener('resize', (e) => {
				this.listenToOverflow();
			});
		}
				
		handleOverflow(){
			try{
				if(!document.querySelector(`.forward-arrows-${this.selector}`).classList.contains('active-arrow'))
					document.querySelector(`.forward-arrows-${this.selector}`).classList.add('active-arrow');
			} catch(e){
				console.log(e);
			}
		}
		
		handleUnderflow(){
			try{
				document.querySelector(`.forward-arrows-${this.selector}.active-arrow`).classList.remove('active-arrow');
			} catch(e){
				console.log(e);
			}
		}
		
		handleScrollForward(){
			if(!this.isListenerForward)
				document.querySelector(`.forward-arrows-${this.selector}.active-arrow`).addEventListener('click',(e)=>{
					this.isListenerForward = true;
					this.listenToOverflow();
					
					if(this.isOverflow) {
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0].classList.add('hiddenByScroll');
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0].classList.add(`${this.selector}-children-hidden`);
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0].classList.remove(`${this.selector}-children`);
						
						if(!document.querySelector(`.back-arrows-${this.selector}`).classList.contains('active-arrow')) {
							document.querySelector(`.back-arrows-${this.selector}`).classList.add('active-arrow');
							this.handleScrollBack();
						}	
					}
				})
		}
		
		handleScrollBack(){
			if(!this.isListenerBack)
				document.querySelector(`.back-arrows-${this.selector}.active-arrow`).addEventListener('click',(e)=>{
					this.isListenerBack = true;
					this.listenToOverflow();
					
					let hq = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`).length;
					
					if(hq > 0) {
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1].classList.remove('hiddenByScroll');
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1].classList.add(`${this.selector}-children`);
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1].classList.remove(`${this.selector}-children-hidden`);
					}
					
					if(hq === 1)
						document.querySelector(`.back-arrows-${this.selector}.active-arrow`).classList.remove('active-arrow');
					
				})
		}
		
	}
	
	class DevicePopup {
		constructor(selector){
			this.selector = selector;
			
			this.addClickListener();
			this.addCloseListener();
		}
		
		addClickListener(){
			let self = this;
			
			let listener = function(e) {
					if(!e.target.classList.contains('controlButton')) {
						this.classList.add('popup-device-panel');
						this.getElementsByClassName('smallview')[0].classList.add('hidden');
						this.getElementsByClassName('popupview')[0].classList.remove('hidden');
						document.querySelector('.blur').classList.remove('hidden');
						e.target.removeEventListener('click', listener, false);
					}
			}
			
			
			document.querySelectorAll(`.${this.selector}`).forEach((el) => {
				el.addEventListener('click', listener, false);
			})
		}
		
		addCloseListener() {
			document.querySelectorAll(`.controlButton`).forEach(el => {
				el.addEventListener('click', function (e) {
					document.querySelector('.blur').classList.add('hidden');
					this.parentElement.parentElement.classList.add('hidden');
					this.parentElement.parentElement.previousElementSibling.classList.remove('hidden');
					this.parentElement.parentElement.parentElement.classList.remove('popup-device-panel');
					self.isPoped = false;
				})
			})
		}
	}
	
	let deviceScroller = new Scroller('devices', 1, 200, 15);
	let scenariosScroller = new Scroller('scenarios', 3, 200, 15);
	let dbScroller = new Scroller('device-block', 1, 200);
	let devicePopup = new DevicePopup('device-panel');
})();