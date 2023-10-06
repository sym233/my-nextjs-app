import { PasswordHasher } from '../../../src/pwd';

describe('password hasher', () => {
  const pwd = 'testpassword';

  it('should match pwd', () => {
    const { hashedPassword, salt } = PasswordHasher.createHashedPassword(pwd);
    assert(PasswordHasher.validate(pwd, salt, hashedPassword));
  });
  
  it('should not match pwd', () => {
    const pwd2 = 'testpassword2';
    const { hashedPassword, salt } = PasswordHasher.createHashedPassword(pwd);
    assert.isFalse(PasswordHasher.validate(pwd2, salt, hashedPassword));

    const pwd3 = 'teztpassword';
    assert.isFalse(PasswordHasher.validate(pwd3, salt, hashedPassword));
  });
});