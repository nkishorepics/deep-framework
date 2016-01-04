'use strict';

import chai from 'chai';
import {Response} from '../../lib/Resource/Response';
import {Resource} from '../../lib/Resource';
import {Request} from '../../lib/Resource/Request';
import {Action} from '../../lib/Resource/Action';
import Kernel from 'deep-kernel';
import Cache from 'deep-cache';
import Security from 'deep-security';
import KernelFactory from '../common/KernelFactory';

suite('Resource/Response', function() {
  let backendKernelInstance = null;
  let action = null;
  let request = null;
  let response = null;
  let microserviceIdentifier = 'hello.world.example';
  let resourceName = 'sample';
  let actionName = 'say-hello';
  let payload = '{"body":"bodyData"}';
  let method = 'POST';
  let rawData = {Payload: '{"dataKey":"testValue"}', StatusCode: 201};
  let rawError = { message: 'errorMessage'};

  test('Class Response exists in Resource/Response', function() {
    chai.expect(typeof Response).to.equal('function');
  });

  test('Load Kernel by using Kernel.load()', function(done) {
    let callback = (backendKernel) => {
      chai.assert.instanceOf(
        backendKernel, Kernel, 'backendKernel is an instance of Kernel'
      );

      backendKernelInstance = backendKernel;

      // complete the async
      done();

    };

    KernelFactory.create({
      Cache: Cache,
      Security: Security,
      Resource: Resource,
    }, callback);
  });

  test('Check getting action from Kernel instance', function() {
    action = backendKernelInstance.get('resource').get(
      `@${microserviceIdentifier}:${resourceName}:${actionName}`
    );

    chai.assert.instanceOf(
      action, Action, 'action is an instance of Action'
    );
  });

  test('Check creating request > response from action instance', function() {
    request = new Request(action, payload, method);
    response = new Response(request, rawData, JSON.stringify(rawError));

    chai.assert.instanceOf(
      response, Response, 'response is an instance of Response'
    );
  });

  test('Check constructor sets _request', function() {
    chai.expect(response.request).to.be.eql(request);
  });

  test('Check constructor sets _rawData', function() {
    chai.expect(response.rawData).to.be.equal(rawData);
  });

  test('Check isError getter returns true', function() {
    chai.expect(response.isError).to.be.equal(false);
  });
});
