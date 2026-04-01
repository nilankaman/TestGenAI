do $$
begin
    if not exists (select 1 from projects limit 1) then

        insert into projects (id, name, description) values
            ('a1b2c3d4-0000-0000-0000-000000000001', 'User Auth Module',    'Login, register, OAuth flows'),
            ('a1b2c3d4-0000-0000-0000-000000000002', 'E-Commerce Checkout', 'Cart, payment, order processing'),
            ('a1b2c3d4-0000-0000-0000-000000000003', 'Mobile Banking App',  'Transfers, balance, notifications');

        insert into generation_requests
            (id, feature_description, framework, output_format, coverage_type, status, tokens_used, project_id, created_at, completed_at)
        values
            (
                'b1b2c3d4-0000-0000-0000-000000000001',
                'User login with email and password. Validate email format, check credentials, return JWT on success, lock account after 5 failed attempts.',
                'junit5', 'CODE', 'ALL', 'COMPLETED', 1842,
                'a1b2c3d4-0000-0000-0000-000000000001',
                now() - interval '3 days', now() - interval '3 days' + interval '12 seconds'
            ),
            (
                'b1b2c3d4-0000-0000-0000-000000000002',
                'Add item to cart. Check stock availability, update cart total, apply discount codes, handle out-of-stock edge cases.',
                'selenium', 'CODE', 'ALL', 'COMPLETED', 1654,
                'a1b2c3d4-0000-0000-0000-000000000002',
                now() - interval '2 days', now() - interval '2 days' + interval '9 seconds'
            ),
            (
                'b1b2c3d4-0000-0000-0000-000000000003',
                'Bank transfer between accounts. Validate balance, enforce daily limits, send notification, record transaction.',
                'appium', 'CODE', 'POSITIVE', 'COMPLETED', 1290,
                'a1b2c3d4-0000-0000-0000-000000000003',
                now() - interval '1 day', now() - interval '1 day' + interval '8 seconds'
            );

        insert into test_cases (title, type, description, code_snippet, method_name, generation_request_id) values
            (
                'Valid login returns JWT token',
                'POSITIVE',
                'POST /api/auth/login with valid email+password should return 200 and a non-null JWT in the response body.',
                '@Test
void validLoginReturnsJwt() {
    var response = given()
        .body(Map.of("email", "user@test.com", "password", "secret123"))
        .post("/api/auth/login");
    response.then().statusCode(200);
    assertNotNull(response.jsonPath().getString("token"));
}',
                'validLoginReturnsJwt',
                'b1b2c3d4-0000-0000-0000-000000000001'
            ),
            (
                'Wrong password returns 401',
                'NEGATIVE',
                'POST /api/auth/login with wrong password should return 401 Unauthorized.',
                '@Test
void wrongPasswordReturns401() {
    given()
        .body(Map.of("email", "user@test.com", "password", "wrongpass"))
        .post("/api/auth/login")
        .then()
        .statusCode(401);
}',
                'wrongPasswordReturns401',
                'b1b2c3d4-0000-0000-0000-000000000001'
            ),
            (
                'Account locks after 5 failed attempts',
                'EDGE',
                'After 5 consecutive failed login attempts the account should be locked and return 423.',
                '@Test
void accountLocksAfterFiveFailures() {
    for (int i = 0; i < 5; i++) {
        given().body(Map.of("email", "user@test.com", "password", "wrong")).post("/api/auth/login");
    }
    given()
        .body(Map.of("email", "user@test.com", "password", "secret123"))
        .post("/api/auth/login")
        .then()
        .statusCode(423);
}',
                'accountLocksAfterFiveFailures',
                'b1b2c3d4-0000-0000-0000-000000000001'
            );

    end if;
end $$;
