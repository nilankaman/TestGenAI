package com.testgen.respository;

import com.testgen.entity.User; // Change this to .model.User if that's where it lives
import com.testgen.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveUser() {
        User user = new User();
        user.setEmail("test@test.com");
        user.setPasswordHash("hash");
        user.setName("Nilank");
        
        User saved = UserRepositoryTest.save(user);
        assertNotNull(saved.getId());
    }

	private static User save(User user) {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'save'");
	}
}