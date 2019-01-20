class Router
{
  constructor()
  {
    this.$ =
    {
      links: document.querySelectorAll('a'), // Pense à distinguer les liens internes/externes
      content: document.querySelector('.content'),
    }

    this.datas = 
    {
      documentTitle: document.title
    }

    this.initalResponse = 
    {
      DOM: this.$.content.innerHTML,
      title: this.datas.documentTitle
    }

    this.cached = {}

    this._listeners()
    this._checkUrl()
    this._disabledLinks()
    this._pushState(this.initalResponse, '/')
    this._runController('')
  }

  _listeners()
  {
    window.addEventListener('visibilitychange', () => { this._dontLeave() })
    window.addEventListener('popstate', (event) => { this._handlePopState(event) })
  }

  _disabledLinks()
  {
    for(let i = 0; i < this.$.links.length; i++)
    {
      this.$.links[i].addEventListener('click', (event) => { this._handleLinks(event, this.$.links[i]) })
    }
  }

  _handleLinks(_event, _link)
  {
    _event.preventDefault()
  
    const path = _link.getAttribute('href')

    this._craftAjaxDOM(path)
  }

  _checkUrl()
  {
    console.log(window.location.pathname)
    const pathname = window.location.pathname

    for(let i = 0; i < this.$.links.length; i++)
    {
      const src = this.$.links[i].getAttribute('href')
      console.log(this.$.links[i].getAttribute("href"))

      if(src == pathname)
      {
        this._craftAjaxDOM(pathname)
      }
      else
      {
        this._pushState(this.initalResponse, '/')
      }
    }
  }

  _dontLeave()
  {
    document.title == 'ε(´סּ︵סּ`)з' ? document.title = this.datas.documentTitle : document.title = "ε(´סּ︵סּ`)з"
  }

  _handlePopState(_event)
  {
    if(_event.state)
    {
      document.title = _event.state.documentTitle
      document.querySelector(".content").innerHTML = _event.state.DOM

      // Update links
      this.$.links = document.querySelectorAll('a')
      this._disabledLinks()

      // Run current controller
      this._runController(_event.path[0].location.pathname)
    }
  }

  _craftAjaxDOM(_path)
  { 
    // Ajax request
    this._getPage('pages' + _path + '.html', 'body', '.content', _path)
  }

  _pushState(_response, _path)
  {
    window.history.pushState({ DOM: _response.DOM, documentTitle: _response.title },"", _path)
  }

  _getPage(_url, _from = "body", _to = "body", _path)
  {
    let to = {}

    this._waitCursor()

    to.DOM = document.querySelector(_to)
    to.title = document.title

    if(this.cached.DOM && this.cached.url == _url)
    { 
      document.body.style.cursor = 'auto'
      to.title = this.cached.title
      to.DOM.innerHTML = this.cached.DOM 

      this._pushState(this.cached, _path)
      this._runController(_path)
    }
    else
    {
      const XHRt = new XMLHttpRequest // New ajax
  
      XHRt.responseType = 'document'  // Ajax2 context and onload() event
      XHRt.onload = () => 
      { 
        this._waitCursor(false)
  
        this.cached.DOM = to.DOM.innerHTML = XHRt.response.querySelector(_from).innerHTML
        this.cached.title = document.title = XHRt.response.querySelector('title').innerHTML
        this.cached.url = _url

        this._pushState(this.cached, _path)
        this._runController(_path)
        this._checkUrl()
      }
      XHRt.open("GET", _url, true)
      XHRt.send()
    }
  }

  _runController(_path = '/')
  {
    switch (_path) {
      case '/':
        // console.log('run home controller')
        break
      case '/project1':
        // console.log('run project1 controller')
        break
      case '/project2':
        // console.log('run project2 controller')
        break
      default:
        break;
    }
  }

  _cachedImage()
  {
    const images = document.querySelectorAll('img')

    this.cached.images = []

    for(let i = 0; i < images.length; i++)
    {
      const cachedImage = new Image()
      cachedImage.src = images[i].getAttribute('src')

      this.cached.images.push(cachedImage)
    }

    console.log(this.cached.images)
  }

  _pullImage()
  {
    const images = document.querySelectorAll('img')

    for(let i = 0; i < images.length; i++)
    {
      images[i] = this.cached.images[i]
    }
  }

  _waitCursor(_state = true)
  {
    if(_state)
    {
      document.body.style.cursor = 'wait'
  
      for(let i = 0; i < this.$.links.length; i++)
      {
        this.$.links[i].style.cursor = 'wait'
      }
    }
    else
    {
      document.body.style.cursor = 'auto'
  
      for(let i = 0; i < this.$.links.length; i++)
      {
        this.$.links[i].style.cursor = 'auto'
      }
    }
  }
}

new Router()