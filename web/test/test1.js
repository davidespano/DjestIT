QUnit.test("Composition", function(assert) {
    var term1 = new djestit.GroundTerm();
    var term2 = new djestit.GroundTerm();
    var term3 = new djestit.GroundTerm();
    var term4 = new djestit.GroundTerm();
    var sequence = new djestit.Sequence([term1, term2]);
    var parallel = new djestit.Parallel([term3, term4]);

    assert.ok(sequence.children !== parallel.children, "Passed");
});

QUnit.test("Iterative operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    var iterative = new djestit.Iterative(term1);

    iterative.fire(new djestit.Token());
    assert.ok(djestit.COMPLETE === iterative.state, "First iteration completed");

    // execute the term more than once
    iterative.fire(new djestit.Token());
    assert.ok(djestit.COMPLETE === iterative.state, "Second iteration completed");

});

QUnit.test("Sequence operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    var term2 = new djestit.GroundTerm();
    var sequence1 = new djestit.Sequence([term1, term2]);


    sequence1.onComplete.add(function() {
        console.log(sequence1.state);
    });

    sequence1.fire(new djestit.Token());
    sequence1.fire(new djestit.Token());

    assert.ok(djestit.COMPLETE === sequence1.state, "Sequence completed");

    sequence1.fire(new djestit.Token());
    assert.ok(djestit.ERROR === sequence1.state, "No more token accepted");
});



QUnit.test("Iterative operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    var iterative = new djestit.Iterative(term1);


    iterative.onComplete.add(function() {
        assert.ok(djestit.COMPLETE === iterative.state, "Iteration completed");
    });

    iterative.fire(new djestit.Token());
    iterative.fire(new djestit.Token());


});

QUnit.test("Parallel operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    var term2 = new djestit.GroundTerm();
    var parallel = new djestit.Parallel([term1, term2]);


    term1.onComplete.add(function() {
        assert.ok(djestit.COMPLETE === term1.state, "Operand 1 ok");
    });

    term2.onComplete.add(function() {
        assert.ok(djestit.COMPLETE === term2.state, "Operand 2 ok");
    });

    parallel.fire(new djestit.Token());

    assert.ok(djestit.COMPLETE === parallel.state, "Passed!");
});

QUnit.test("Parallel operator 1", function(assert) {
    var term1 = new djestit.GroundTerm();
    term1.accepts = function(token) {
        return token.type && token.type === "A";
    };
    var term2 = new djestit.GroundTerm();
    term2.accepts = function(token) {
        return token.type && token.type === "B";
    };
    term1.onComplete.add(function() {
        assert.ok(djestit.COMPLETE === term1.state, "Operand 1 ok");
    });

    term2.onComplete.add(function() {
        assert.ok(djestit.COMPLETE === term2.state, "Operand 2 ok");
    });
    
    var iterative1 = new djestit.Iterative(term1);
    var iterative2 = new djestit.Iterative(term2);
    var parallel = new djestit.Parallel([iterative1, iterative2]);
    var tokenA = new djestit.Token();
    tokenA.type = "A";

    var tokenB = new djestit.Token();
    tokenB.type = "B";

    parallel.fire(tokenA);
    parallel.fire(tokenA);
    parallel.fire(tokenB);

    assert.ok(djestit.COMPLETE === parallel.state, "Passed!");
});


QUnit.test("Choice operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    term1.accepts = function(token) {
        return token.type && token.type === "A";
    };
    var term2 = new djestit.GroundTerm();
    var term3 = new djestit.GroundTerm();
    term3.accepts = function(token) {
        return token.type && token.type === "B";
    };
    var term4 = new djestit.GroundTerm();
    term4.accepts = function(token) {
        return token.type && token.type === "B";
    };

    var sequence = new djestit.Sequence([term1, term2]);
    var parallel = new djestit.Parallel([term3, term4]);

    var choice = new djestit.Choice([sequence, parallel]);
    var tokenA = new djestit.Token();
    tokenA.type = "A";

    var tokenB = new djestit.Token();
    tokenB.type = "B";

    choice.fire(tokenA);
    choice.fire(tokenA);

    assert.ok(sequence.state === djestit.COMPLETE, "First operand (sequence) completed");
    assert.ok(choice.state === djestit.COMPLETE, "Choice completed");

    choice.reset();

    choice.fire(tokenB);
    assert.ok(parallel.state === djestit.COMPLETE, "Second operand (parallel) completed");
    assert.ok(choice.state === djestit.COMPLETE, "Choice completed");
});

QUnit.test("OrderIndependence operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    term1.accepts = function(token) {
        return token.type && token.type === "A";
    };
    var term2 = new djestit.GroundTerm();
    var term3 = new djestit.GroundTerm();
    term3.accepts = function(token) {
        return token.type && token.type === "B";
    };
    var term4 = new djestit.GroundTerm();
    term4.accepts = function(token) {
        return token.type && token.type === "A";
    };
    var sequence = new djestit.Sequence([term1, term2]);
    var parallel = new djestit.Parallel([term3, term4]);

    var order = new djestit.OrderIndependence([sequence, parallel]);
    var tokenA = new djestit.Token();
    tokenA.type = "A";

    var tokenB = new djestit.Token();
    tokenB.type = "B";

    order.fire(tokenA);
    order.fire(tokenA);
    assert.ok(sequence.state === djestit.COMPLETE, "First operand (sequence) completed");

    order.fire(tokenB);
    order.fire(tokenA);


    assert.ok(parallel.state === djestit.COMPLETE, "Second operand (parallel) completed");
    assert.ok(order.state === djestit.COMPLETE, "OrderIndependence completed");

    order.reset();

    order.fire(tokenB);
    order.fire(tokenA);
    assert.ok(parallel.state === djestit.COMPLETE, "Second operand (parallel) completed");

    order.fire(tokenA);
    order.fire(tokenA);

    assert.ok(sequence.state === djestit.COMPLETE, "First operand (sequence) completed");
    assert.ok(order.state === djestit.COMPLETE, "OrderIndependence completed");

});

QUnit.test("Disabling operator", function(assert) {
    var term1 = new djestit.GroundTerm();
    term1.accepts = function(token) {
        return token.type && token.type === "A";
    };

    var iterative1 = new djestit.Iterative(term1);

    var term2 = new djestit.GroundTerm();
    term2.accepts = function(token) {
        return token.type && token.type === "B";
    };

    var iterative2 = new djestit.Iterative(term2);

    var term3 = new djestit.GroundTerm();
    term3.accepts = function(token) {
        return token.type && token.type === "C";
    };

    var disabling = new djestit.Disabling([iterative1, iterative2, term3]);

    var tokenA = new djestit.Token();
    tokenA.type = "A";

    var tokenB = new djestit.Token();
    tokenB.type = "B";

    var tokenC = new djestit.Token();
    tokenC.type = "C";

    // a sequence of A tokens
    disabling.fire(tokenA);
    disabling.fire(tokenA);

    // send a C token
    disabling.fire(tokenC);
    assert.ok(disabling.state === djestit.COMPLETE, "C token accepted");

    disabling.reset();

    // all other tokens are not accepted
    disabling.fire(tokenA);
    disabling.fire(tokenB);
    disabling.fire(tokenA);

    assert.ok(disabling.state === djestit.ERROR, "A token after B not accepted");

    disabling.reset();

    // a sequence of A tokens
    disabling.fire(tokenA);
    disabling.fire(tokenA);
    disabling.fire(tokenA);
    disabling.fire(tokenA);

    // stop with a B token
    disabling.fire(tokenB);
    assert.ok(iterative2.state === djestit.COMPLETE, "B tokens accepted");

    disabling.fire(tokenC);
    assert.ok(disabling.state === djestit.COMPLETE, "C token accepted");

});

QUnit.test("Disabling operator", function(assert) {

    var pan = {
        sequence: [
            {gt: "touch.start"},
            {disabling: [
                    {gt: "touch.move", iterative: true},
                    {gt: "touch.end"}
                ]}
        ]
    };

    var panExpression = djestit.expression(pan);

    assert.ok(1 === 1, "ok");
});


QUnit.test("Touch sequence", function(assert) {

    var pinch = {
        sequence: [
            {order: [
                    {gt: "touch.start", id: 1},
                    {gt: "touch.start", id: 2}
                ]},
            {disabling: [
                    {parallel: [
                            {gt: "touch.move", id: 1},
                            {gt: "touch.move", id: 2}
                        ],
                        iterative: true},
                    {order: [
                            {gt: "touch.end", id: 1},
                            {gt: "touch.end", id: 2}
                        ]}
                ]}
        ]
    };

    var newTouch = function(id, pointX, pointY) {
        var t = {
            clientX: pointX,
            clientY: pointY,
            pageX: pointX,
            pageY: pointY,
            screenX: pointX,
            screenY: pointY,
            identifier: id,
            target: {}
        };

        return t;
    };

    var tsensor = new djestit.TouchSensor(document.getElementById("area"), pinch, 3);
    var a1 = newTouch(0, 100, 100);
    var b1 = newTouch(1, 200, 200);
    var a2 = newTouch(0, 101, 101);
    var b2 = newTouch(1, 201, 201);
    var a3 = newTouch(0, 102, 102);

    var sa2 = {};
    var sb2 = {};
    var sa1 = {};
    var sb1 = {};

    var ta1 = tsensor.generateToken(1, a1);
    
    sa1 = tsensor.sequence.getById(0, 1);
    assert.ok(ta1 === sa1, "Passo 1: Tocco 1 delay 0");
    
    var tb1 = tsensor.generateToken(1, b1);
    sa1 = tsensor.sequence.getById(0, 1);
    sb1 = tsensor.sequence.getById(0, 2);
    assert.ok(ta1 === sa1, "Passo 2: Tocco 1 delay 0");
    assert.ok(tb1 === sb1, "Passo 2: Tocco 2 delay 0");
    
    var ta2 = tsensor.generateToken(2, a2);
    sa2 = tsensor.sequence.getById(0, 1);
    sa1 = tsensor.sequence.getById(1, 1);
    sb1 = tsensor.sequence.getById(0, 2);
    assert.ok(ta2 === sa2, "Passo 3: Tocco 1 delay 0");
    assert.ok(ta1 === sa1, "Passo 3: Tocco 1 delay 1");
    assert.ok(tb1 === sb1, "Passo 3: Tocco 2 delay 0");
    
    var tb2 = tsensor.generateToken(2, b2);

    sa2 = tsensor.sequence.getById(0, 1);
    sb2 = tsensor.sequence.getById(0, 2);
    sa1 = tsensor.sequence.getById(1, 1);
    sb1 = tsensor.sequence.getById(1, 2);

    assert.ok(ta2 === sa2, "Passo 4: Tocco 1 delay 0");
    assert.ok(tb2 === sb2, "Passo 4: Tocco 2 delay 0");
    assert.ok(ta1 === sa1, "Passo 4: Tocco 1 delay 1");
    assert.ok(tb1 === sb1, "Passo 4: Tocco 2 delay 1");
    
    var ta3 = tsensor.generateToken(2, a3);
    var sa3 = tsensor.sequence.getById(0, 1);
    sa2 = tsensor.sequence.getById(1,1);
    tb2 = tsensor.sequence.getById(0,2);
    tb1 = tsensor.sequence.getById(1,2);
    
    assert.ok(ta3 === sa3, "Passo 5: Tocco 1 delay 0");
    assert.ok(ta2 === sa2, "Passo 5: Tocco 2 delay 0");
    assert.ok(tb2 === sb2, "Passo 5: Tocco 1 delay 1");
    assert.ok(tb1 === sb1, "Passo 5: Tocco 2 delay 1");
    


});


