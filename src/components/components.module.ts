import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login';
import { MenuComponent } from './menu/menu';
import { IonicModule } from '../../node_modules/ionic-angular';
import { CustomCurrencyDecoratorPipe } from '../models/custom-currency-decorator.pipe';
@NgModule({
	declarations: [
		LoginComponent,
		MenuComponent,
		CustomCurrencyDecoratorPipe
	],
	imports: [
		IonicModule
	],
	exports: [
		LoginComponent,
		MenuComponent,
		CustomCurrencyDecoratorPipe
	]
})
export class ComponentsModule {}
