# Store

### Table of contents

- [Overview](#overview)
- [Read operators](#read-operators)
  - [`select` operator](#select-operator)
  - [`query` operator](#query-operator)
  - [`get` operator](#get-operator)
- [Write operators](#write-operators)
  - [`update` operator](#update-operator)
    - [`patch` operator](#patch-operator)
    - [`property` operator](#property-operator)
    - [`to` operator](#to-operator)
  - [`reset` operator](#reset-operator)
- [Effects operators](#effects-operators)
  - [`fn` operator](#fn-operator)

## Overview

Store is an entity that manages state of an app or its part.

It consists of 4 elements: state, read operators, write operators and effects.

Consider using this approach to design a custom store.

Define a state model:

```ts
export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}
```

```ts
import { Product } from './product';

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}
```

```ts
import { TaskState } from '@ngry/rx';
import { CartItem } from './cart.item';

export interface CartState {
  readonly items: TaskState<readonly CartItem[]>;
}
```

Design store using special operators:

```ts
import { Injectable } from '@angular/core';
import { TaskState, toTask } from '@ngry/rx';
import { fn, property, select, Store, update } from '@ngry/store';
import { map, switchMap, tap } from 'rxjs/operators';
import { CartItem } from './cart.item';
import { CartState } from './cart.state';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class CartStore extends Store<CartState> {
  readonly totalPrice$ = this.pipe(
    select(state => state.items.reduce((price, item) => {
      return price + item.produce.price * item.quantity;
    }, 0))
  );

  constructor(private readonly cartService: CartService) {
    super({
      items: TaskState.initial(),
    });
  }

  readonly load = fn(args$ => args$.pipe(
    switchMap(() => this.cartService.getItems().pipe(
      toTask(),
      tap(update(this, property('items'))),
    )),
  ));

  readonly add = fn<[product: Product, quantity?: number]>(args$ => args$.pipe(
    map(([product, quantity = 1]): CartItem => ({ product, quantity })),
    tap(update(this, property('items', (items, item: CartProduct) => items.map(items => [...items, item])))),
    switchMap((item) => this.cartService.add(item)),
  ));
}
```

⬆️ [Table of contents](#table-of-contents)

## Read operators

Read operators help to build functions for state access.

⬆️ [Table of contents](#table-of-contents)

### `select` operator

It is an RxJS operator which selects a part of state and emits only distinct values.
It also shares the result among subscribers.

In a nutshell it's a shorthand for the pipeline of RxJS operators:

```
select = map -> distinctUntilChanged -> shareReplay
```

**Usage example**

```ts
import { Injectable } from '@angular/core';
import { TaskState } from '@ngry/rx';
import { Store, select } from '@ngry/store';
import { User } from './user';

@Injectable()
class UserStore extends Store<TaskState<User>> {
  readonly user$ = this.pipe(
    select(state => state.result),
  );
}
```

⬆️ [Table of contents](#table-of-contents) | [Read operators](#read-operators)

### `query` operator

Creates a function which, once called, returns a stream of selected distinct
values. Function may have any number of arguments to customize the query.

**Usage example**

Declare a query function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, query } from '@ngry/store';

@Injectable()
class TagsStore extends Store<readonly string[]> {
  constructor() {
    super([]);
  }

  readonly findCompositeTags = query(this, (tags, separator: string) =>
    tags.filter((tag) => tag.includes(separator)),
  );
}
```

Call the query function:

```ts
import { Component } from '@angular/core';
import { TagsStore } from './tags.store';

@Component()
class TagsComponent {
  readonly compositeTags$ = this.store.findCompositeTags(':');

  constructor(private readonly store: TagsStore) {
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Read operators](#read-operators)

### `get` operator

Creates a getter function which, once called, returns a value of the given
state's property.

**Usage example**

Declare a getter function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { TaskState } from '@ngry/rx';
import { get, Store } from '@ngry/store';
import { User } from './user';

@Injectable()
class UserStore extends Store<TaskState<User>> {
  constructor() {
    super(TaskState.initial());
  }

  readonly getResult = get(this, 'result');
}
```

Call the getter function:

```ts
import { Component } from '@angular/core';
import { UserStore } from './user.store'

@Component()
class UserComponent {
  constructor(private readonly store: UserStore) {
  }

  deleteAccount() {
    const user = this.store.getResult();
    // do smth with user
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Read operators](#read-operators)

## Write operators

Write operators help to build functions for state update.

⬆️ [Table of contents](#table-of-contents)

### `update` operator

Creates a state update function which, once called, replaces store's state with a new value.

**Usage example**

Create an updater function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, update } from '@ngry/store';
import { User } from './user';

@Injectable()
class UserStore extends Store<User> {
  readonly rename = update(
    this,
    (user: User, firstName: string, lastName: string): User => {
      return {
        ...user,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
      };
    },
  );

  readonly changeEmail = update(
    this,
    (user: User, email: string): User => {
      return {
        ...user,
        email,
        emailVerified: user.email === email ? user.emailVerified : false,
      };
    },
  );
}
```

Call the updater function:

```ts
import { Component } from '@angular/core';
import { UserStore } from './user.store';

@Component()
class UserComponent {
  constructor(private readonly store: UserStore) {
  }

  rename(firstName: string, lastName: string) {
    this.store.rename(firstName, lastName);
  }

  changeEmail(email: string) {
    this.store.changeEmail(email);
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Write operators](#write-operators)

#### `patch` operator

Allows update delegate to return a partial state.

**Usage example**

Create an updater function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { patch, Store, update } from '@ngry/store';
import { User } from './user';

@Injectable()
class UserStore extends Store<User> {
  readonly rename = update(
    this,
    patch((_: User, firstName: string, lastName: string): Partial<User> => {
      return {
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
      };
    }),
  );

  readonly changeEmail = update(
    this,
    patch((user: User, email: string): Partial<User> => {
      return {
        email,
        emailVerified: user.email === email ? user.emailVerified : false,
      };
    }),
  );
}
```

Call the updater function:

```ts
import { Component } from '@angular/core';
import { UserStore } from './user.store';

@Component()
class UserComponent {
  constructor(private readonly store: UserStore) {
  }

  rename(firstName: string, lastName: string) {
    this.store.rename(firstName, lastName);
  }

  changeEmail(email: string) {
    this.store.changeEmail(email);
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Write operators](#write-operators)

#### `property` operator

Limits an update to a specific state property.

**Usage example**

Create an updater function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, property, update } from '@ngry/store';

@Injectable()
class PersonStore extends Store<Person> {
  readonly rename = update(this, property('name'));
}
```

Call the updater function:

```ts
import { Component } from '@angular/core';
import { PersonStore } from './person.store';

@Component()
class PersonComponent {
  constructor(private readonly store: PersonStore) {
  }

  onNameChange(name: string) {
    this.store.rename(name);
  }
}
```

It can be nested to limit update on even more nested property.

**Usage example**

Create an updater function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, property, update } from '@ngry/store';

@Injectable()
class OfficeStore extends Store<Office> {
  readonly setCity = update(this, property('address', property('city')));
}
```

Call the updater function:

```ts
import { Component } from '@angular/core';
import { GeoData } from 'geo-lib';
import { OfficeStore } from './office.store';

@Component()
class OfficeComponent {
  constructor(private readonly store: OfficeStore) {
  }

  onLocationChange(data: GeoData) {
    this.store.setCity(data.address.city);
  }
}
```

It can be customized to provide a different update logic for property.

**Usage example**

Create an updater function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, property, update } from '@ngry/store';
import { Article } from './article';

@Injectable()
class ArticleStore extends Store<Article> {
  readonly clap = update(this, property('claps', claps => claps + 1));
}
```

Call the updater function:

```ts
import { Component } from '@angular/core';
import { ArticleStore } from './article.store';

@Component()
class ArticleComponent {
  constructor(private readonly store: ArticleStore) {
  }

  clap() {
    this.store.clap();
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Write operators](#write-operators)

#### `to` operator

Replaces the whole state with a provided one.

**Usage example**

Create an updater function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, update, to } from '@ngry/store';

@Injectable()
class CounterStore extends Store<number> {
  readonly reset = update(this, to(this.initial));
}
```

Call the updater function:

```ts
import { Component } from '@angular/core';
import { CounterStore } from './counter.store';

@Component()
class CounterComponent {
  constructor(private readonly store: CounterStore) {
  }

  reset() {
    this.store.reset();
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Write operators](#write-operators)

### `reset` operator

Creates a reset function which, once called, sets the store's state to its
initial value.

**Usage example**

Declare a reset function within your custom store:

```ts
import { Injectable } from '@angular/core';
import { Store, reset } from '@ngry/store';

@Injectable()
class CounterStore extends Store<number> {
  constructor() {
    super(0);
  }

  readonly reset = reset(this);
}
```

Call the reset function:

```ts
import { Component } from '@angular/core';
import { CounterStore } from './counter.store'

@Component()
class CounterComponent {
  constructor(private readonly store: CounterStore) {
  }

  reset() {
    this.store.reset();
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Write operators](#write-operators)

## Effects operators

Effects operators help to build functions containing side effects.

⬆️ [Table of contents](#table-of-contents)

### `fn` operator

Creates a function which, once called, executes a reactive pipeline with side effects;
its arguments are being pushed to this pipeline as a tuple.

**Usage example**

Declare a side effects function within your custom store:

```ts
import { Injectable, Input, OnInit } from '@angular/core';
import { Store, fn, update } from '@ngry/store';
import { TaskState, toTask } from '@ngry/rx';
import { switchMap, tap } from 'rxjs/operators'
import { AccountService } from './account.service';
import { Account } from './account';

@Injectable()
class AccountStore extends Store<TaskState<Account>> {
  constructor(private readonly accounts: AccountService) {
    super(TaskState.initial());
  }

  readonly load = fn<[id: string]>((args$) =>
    args$.pipe(
      switchMap(([id]) => this.accounts.get(id).pipe(toTask())),
      tap(update(this)),
    ),
  );
}
```

Call the side effects function:

```ts
import { Component, Input, OnInit } from '@angular/core';
import { AccountStore } from './account.store';

@Component()
class AccountComponent implements OnInit {
  @Input()
  id: string;

  constructor(private readonly store: AccountStore) {
  }

  ngOnInit() {
    this.store.load(this.id);
  }
}
```

⬆️ [Table of contents](#table-of-contents) | [Effects operators](#effects-operators)
