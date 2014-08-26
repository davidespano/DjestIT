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
    var sequence = new djestit.Sequence([term1, term2]);
    var parallel = new djestit.Parallel([term3, term4]);

    var order = new djestit.OrderIndependence([sequence, parallel]);
    var tokenA = new djestit.Token();
    tokenA.type = "A";

    var tokenB = new djestit.Token();
    tokenB.type = "B";

    order.fire(tokenA);
    order.fire(tokenA);
    order.fire(tokenB);

    assert.ok(sequence.state === djestit.COMPLETE, "First operand (sequence) completed");
    assert.ok(parallel.state === djestit.COMPLETE, "Second operand (parallel) completed");
    assert.ok(order.state === djestit.COMPLETE, "OrderIndependence completed");

    order.reset();

    order.fire(tokenB);
    order.fire(tokenA);
    order.fire(tokenA);
    assert.ok(sequence.state === djestit.COMPLETE, "First operand (sequence) completed");
    assert.ok(parallel.state === djestit.COMPLETE, "Second operand (parallel) completed");
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
    
    assert.ok(disabling.state === djestit.COMPLETE, "A tokens accepted");
    
    // send a C token
    disabling.fire(tokenC);
    
    // all other tokens are not accepted
    disabling.fire(tokenB);
    
    assert.ok(disabling.state === djestit.ERROR, "B token not accepted");
    
    disabling.reset();
    
    // a sequence of A tokens
    disabling.fire(tokenA);
    disabling.fire(tokenA);
    disabling.fire(tokenA);
    disabling.fire(tokenA);
    
    // stop with a B token
    disabling.fire(tokenB);
    assert.ok(disabling.state === djestit.COMPLETE, "B tokens accepted");
    
    disabling.fire(tokenA);
    assert.ok(disabling.state === djestit.ERROR, "A token not accepted");
    
});