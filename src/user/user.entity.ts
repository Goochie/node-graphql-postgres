import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field} from 'type-graphql';
import { PostCode } from '../postcode/post-code.entity';
import { UserSaving } from './user-saving.entity';
import { Fund } from '../fund/fund.entity';

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({length: 100})
    @Index({unique: true})
    email: string;

    @Column({name: 'password_hash'})
    passwordHash: string;

    @Column({name: 'stripe_id', nullable: true})
    stripeId: string;

    @Column({length: 20, nullable: true })
    mobile: string;

    @Column({name: 'reset_token', nullable: true})
    resetToken?: string;

    @Column({name: 'reset_token_date', nullable: true})
    resetTokenDate?: Date;

    @ManyToOne(type => PostCode, postcode => postcode.users, { nullable: true })
    @JoinColumn({ name: 'postcode_id' })
    postcode: PostCode;

    @Column({type: 'simple-array', nullable: true})
    compliteTodo?: string[];

    @Column({default: false})
    orgTodo?: boolean;

    @Column({default: false})
    todo?: boolean;

    @Column({name: 'email_verify_token', nullable: true, default: 'none'})
    emailVerifyToken?: string;

    @Column({default: false})
    public?: boolean;

    @Column({nullable: true, default: ''})
    bio?: string;

    @Column({nullable: true, default: ''})
    userStatus?: string;

    @Column({nullable: true, default: ''})
    billingAddress?: string;

    @Column({nullable: true, default: ''})
    billingName?: string;

    @Column({nullable: true, default: ''})
    defaultPayment?: string;

    @Column({nullable: true})
    stripeUserId: string;

    @Column({nullable: true})
    stripeAuthToken: string;

    @Column({nullable: true})
    stripeAuthRefreshToken: string;

    @ManyToMany(type => User, { nullable: true })
    @JoinTable({name: 'user_followers', joinColumn: {name: 'profile_id'}, inverseJoinColumn: {name: 'user_id'}})
    followers?: User[];

    @ManyToMany(type => User, { nullable: true })
    @JoinTable({name: 'user_followers', joinColumn: {name: 'user_id'}, inverseJoinColumn: {name: 'profile_id'}})
    following?: User[];

    @Column({nullable: true, name: 'default_fund'})
    defaultFund?: number;

    @Column({nullable: true, name: 'support_type'})
    supportType: string;

    @Column({nullable: true})
    location: string;

    get emailVerify() {
      return !this.emailVerifyToken;
    }

    @Column({name: 'photo_url', nullable: true})
    photoUrl$: string;
    @OneToMany(type => UserSaving, saving => saving.user)
    saving?: UserSaving[];

    status: string;

    get photoUrl() {
      if (this.photoUrl$) {
        return this.photoUrl$;
      }
      const [first, ...parts] = this.username.split(' ');
      const last = parts[parts.length - 1] || '';

      const firstLeters = encodeURI((first[0] + '' + (last[0] || '')).toUpperCase());
      return `https://via.placeholder.com/300/${color(first.charCodeAt(0) + last.charCodeAt(0))}/FFFFFF?text=${firstLeters}`;
    }

    set photoUrl(val: string) {
      this.photoUrl$ = val;
    }

    constructor(partial: Partial<User>) {
      Object.assign(this, partial);
    }
}

function color(char: number) {
  const colors = ['1ABC9C', '3498DB', '8E44AD', 'F39C12', 'D35400'];
  let sum = char;
  while (sum > 10) {
    sum = sum.toString().split('').reduce<number>((a, b) => (+a) + (+b), 0);
  }
  return colors[Math.round(sum / 2) - 1];
}
