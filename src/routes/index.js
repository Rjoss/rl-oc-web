const debug = require('debug')('mock:routes/index');
const express = require('express');
const Client = require('oc-client');
const router = express.Router();
const client = new Client({
  registries: { serverRendering: process.env.OC_REGISTRY_BASE_URL },
  templates: [
    require('oc-template-es6'),
    require('oc-template-react')
  ],
  components: {
    nav: '1.0.0'
  }
});

const component_url = `${process.env.OC_REGISTRY_BASE_URL}${process.env.OC_COMPONENT_NAME}/${process.env.OC_COMPONENT_VERSION}`;

let clientInitOptions = {
  headers: { 'accept-language': 'en-US' },
  timeout: 5,
  renderComponents: function (error, responses) {
    console.log(error);
    // => something like null or Error making request to registry

    console.log(responses);
    // => something like { hello: '<b>hello</b>'}
  }
};

client.init(clientInitOptions);

client.getComponentsInfo([{
  name: 'nav',
  version: '1.0.0'
}], function (error, infos) {
  console.log(error);
  console.log(infos);
});

const throwMissingName = () => {
  throw new Error("the OpenComponents component's name is missing");
};

const components = [
  {
    name: process.env.OC_COMPONENT_NAME || throwMissingName(),
    version: process.env.OC_COMPONENT_VERSION || '',
    parameters: JSON.parse(process.env.OC_COMPONENT_PARAMETERS || '{}')
  }
];

// Respond to all GET requests by rendering relevant page using Nunjucks
router.get('/:page', function (req, res) {
  let template = req.path.slice(1);

  if (template === 'demo-server-side') {
    client.renderComponents(
      components,
      {
        container: false,
        headers: {
          'Accept-Language': 'en-US'
        },
        timeout: 3.0
      },
      (errors, htmls) => {
        if (errors) {
          debug('errors:', errors);
        }
        debug('htmls[0]:', htmls[0]);
        res.render(`${template}.html`, {
          component: htmls[0],
          client_url: process.env.OC_CLIENT_URL
        });
      }
    );
  } else {
    res.render(`${template}.html`, {
      component_url: component_url,
      client_url: process.env.OC_CLIENT_URL
    });
  }
});

module.exports = router;
