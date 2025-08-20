const { useState } = React;

function App() {
  const [image, setImage] = useState(null);
  const [events, setEvents] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.file.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/timeline', { method: 'POST', body: form });
    const data = await res.json();
    setImage('data:image/png;base64,' + data.image);
    setEvents(data.events);
  };

  return (
    React.createElement('div', null,
      React.createElement('form', { onSubmit: handleUpload },
        React.createElement('input', { type: 'file', name: 'file' }),
        React.createElement('button', { type: 'submit' }, 'Upload')
      ),
      image && React.createElement('img', { src: image, alt: 'timeline' }),
      React.createElement('table', null,
        React.createElement('tbody', null,
          events.map((e, i) =>
            React.createElement('tr', { key: i },
              React.createElement('td', null, e.date),
              React.createElement('td', null, e.description)
            )
          )
        )
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
