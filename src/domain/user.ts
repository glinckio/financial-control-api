export type UserProps = {
  name: string;
  surname: string;
  email: string;
  password: string;
};

export class User {
  public readonly id: number;
  public props: Required<UserProps>;

  private constructor(props: UserProps, id?: number) {
    this.id = id || new Date().getTime();
    this.props = {
      ...props,
    };
  }

  static create(props: UserProps, id?: number): User {
    return new User(props, id);
  }

  updateName(name: string) {
    this.name = name;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  updateSurname(surname: string) {
    this.surname = surname;
  }

  get surname() {
    return this.props.surname;
  }

  private set surname(value: string) {
    this.props.surname = value;
  }

  updateEmail(email: string) {
    this.email = email;
  }

  get email() {
    return this.props.email;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  updatePassword(password: string) {
    this.password = password;
  }

  get password() {
    return this.props.password;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  toJSON() {
    return {
      id: this.id,
      ...this.props,
    };
  }
}
