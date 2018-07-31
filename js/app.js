(function(){	
	class Scroller {
		constructor(selector, margin){
			this.selector = selector;
			this.margin = margin;
			this.isOverflow;
			this.isTimeout = false;
			
			this.listenToScreenChange();
			this.handleScrollForward();
			this.handleScrollBack();
			this.checkOverflow();
		}
		
		checkOverflow(){
			let w = document.getElementById(this.selector).offsetWidth;
			let h = document.getElementById(this.selector).offsetHeight;	
			let totalSize = h * w;
			let children = document.querySelectorAll(`.${this.selector}-children`);
			
			let sum = 0;
			
			children.forEach(child => {
				if(child.offsetWidth > 0)
					sum += (child.offsetWidth + this.margin ) * (child.offsetHeight + this.margin);
			})
			
			this.isOverflow = (totalSize < sum)
		
			if (this.isOverflow) {
				this.handleOverflow();
				this.handleScrollForward();
			} else {
				this.handleUnderflow();
			}	
		}
		
		listenToScreenChange(){
			window.addEventListener('resize', (e) => {
				this.checkOverflow();
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
				document.querySelector(`.forward-arrows-${this.selector}`).classList.remove('active-arrow');
			} catch(e){
				console.log(e);
			}
		}
		
		handleScrollForward(){
			document.querySelector(`.forward-arrows-${this.selector}`).addEventListener('click',(e)=>{
				
				if(this.isOverflow && !this.isTimeout) {
					this.isTimeout = true;
					
					let element = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0];
					element.classList.add('hiddenByScroll');
					
					setTimeout(()=>{
						element.classList.add(`${this.selector}-children-hidden`);
						element.classList.add(`hidden`);
						element.classList.remove(`${this.selector}-children`);
						this.isTimeout = false;
					}, 100);
					
					this.checkOverflow();
				
					if(!document.querySelector(`.back-arrows-${this.selector}`).classList.contains('active-arrow')) {
						document.querySelector(`.back-arrows-${this.selector}`).classList.add('active-arrow');
					}	
				}
				})
		}
		
		handleScrollBack(){
			document.querySelector(`.back-arrows-${this.selector}`).addEventListener('click',(e)=>{
				
				let hq = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`).length;
				
				if(hq > 0) {
					let element = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1];
					element.classList.remove('hiddenByScroll');
					element.classList.remove('hidden');
					element.classList.add(`${this.selector}-children`);
					element.classList.remove(`${this.selector}-children-hidden`);
				}
				
				this.checkOverflow();
				
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
			let listener = function(e) {
					if(!e.target.classList.contains('controlButton')) {
						this.classList.add('openAnimation');
						
						setTimeout(()=>{
							this.classList.add('popup-device-panel');	
							this.getElementsByClassName('smallview')[0].classList.add('hidden');
							this.getElementsByClassName('popupview')[0].classList.remove('hidden');
							this.classList.remove('openAnimation');
							document.querySelector('.blur').classList.remove('hidden');
						},50)
						
						e.target.removeEventListener('click', listener, false);
					}
			}
			
			
			document.querySelectorAll(`.${this.selector}`).forEach((el) => {
				if(!el.classList.contains('hasPopupListener'))
					el.addEventListener('click', listener, false);
				el.classList.add('hasPopupListener');
			})
		}
		
		addCloseListener() {
			document.querySelectorAll(`.controlButton`).forEach(el => {
				el.addEventListener('click', function (e) {
					document.querySelector('.blur').classList.add('hidden');
					this.parentElement.parentElement.classList.add('hidden');
					this.parentElement.parentElement.previousElementSibling.classList.remove('hidden');
					this.parentElement.parentElement.parentElement.classList.remove('popup-device-panel');
				})
			})
		}
	}
	
	class InfiniteScroller {
		constructor(selector, styleClass){
			this.selector = selector;
			this.styleClass = styleClass;
			this.length;
			this.isTimeout = false;
			
			this.addClickListener();
			this.setLength();
		}
		
		addClickListener(){
			document.querySelector(`.infinite-arrow-${this.selector}`).addEventListener('click', this.handleScroll.bind(this));
		}
		
		setLength(){
			this.length = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`).length;
		}
		
		handleScroll(){
			if(!this.isTimeout) {
				this.isTimeout = true;
				
				let parentNode =  document.getElementById(this.selector);
				let children = parentNode.getElementsByClassName(`${this.selector}-children`);
				let scrollBlock = children[0];
				let scrollBlockHTML = scrollBlock.innerHTML;
				
				let newBlock = document.createElement('div');
				newBlock.className = `${this.selector}-children ${this.styleClass}`;
				
				let oldBlock = parentNode.getElementsByClassName(`${this.selector}-children`)[0];
				oldBlock.classList.add('hiddenByScroll');
				
				setTimeout(()=>{
					oldBlock.parentNode.removeChild(oldBlock);
					parentNode.appendChild(newBlock);
					parentNode.getElementsByClassName(`${this.selector}-children`)[this.length - 1].innerHTML =  scrollBlockHTML;
					let newPopup = new DevicePopup('device-panel');
					this.isTimeout = false;
				},100)
				
			}
		}
		
	}
	
	class NavbarCollapser {
		constructor(selector,  menuSelector, navbarSelector){
			this.selector = selector;
			this.navbarSelector = navbarSelector;
			this.menuSelector = menuSelector;
			
			this.listenToMenu();
		}
		
		listenToMenu(){
			document.querySelector(`.${this.selector}`).addEventListener('click', this.handleMenuShowing.bind(this));
		}
		
		handleMenuShowing(){
			document.querySelector(`#${this.menuSelector}`).classList.toggle('hidden-mobile');
			document.querySelector(`.${this.navbarSelector}`).classList.toggle('opened-menu');
		}
	}
	
	class DeviceLinkToggler {
		constructor(selector){
			this.selector = selector;
			this.state = {opened:false}
			
			this.listenToClick();
		}
				
		listenToClick(){
			let links = document.getElementsByClassName(this.selector);
			for (let el of links) {
				try{
					el.addEventListener('click', this.handleClick.bind(this));
				} catch(e) {
					console.log(e)
				}
			}
		}
		
		handleClick(e) {
			let links = document.getElementsByClassName(`${this.selector}`);
			
			if (!window.matchMedia("(max-width: 978px)").matches)
				this.state.opened = true;	
			
			if(!this.state.opened) {
				this.state.opened = true;
				
				for (let el of links) {
					try{
						el.parentElement.classList.remove('hiddenDevicelink');
					} catch(e) {
						console.log(e)
					}
				}
				
			} else {
				this.state.opened = false;
				document.querySelector('.chosenDeviceLink').classList.remove('chosenDeviceLink');
				e.target.classList.add('chosenDeviceLink');
				
				for (let el of links) {
					try{
						if(!el.classList.contains('chosenDeviceLink'))
							el.parentElement.classList.add('hiddenDevicelink');
						else 
							el.parentElement.classList.remove('hiddenDevicelink');
					} catch(e) {
						console.log(e)
					}
				}
				
			}
		}
	}
	
	let deviceScroller = new Scroller('devices', 15);
	let scenariosScroller = new Scroller('scenarios', 15);
	let deiceBlockScroller = new InfiniteScroller('device-block', 'device-panel');
	let devicePopup = new DevicePopup('device-panel');
	let navbarCollapser = new NavbarCollapser('home-navbar-button', 'menu-mobile', 'home-navbar');
	let deviceLinkToggler = new DeviceLinkToggler('devicecategory')
})();