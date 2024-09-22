import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DictionaryService } from './services/DictionaryService';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { WordsComponent } from './components/words/words.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TestsComponent } from './components/tests/tests.component';
import { HomeComponent } from './components/home/home.component';
import { AddWordComponent } from './components/add-word/add-word.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavBarService } from './components/navbar/navbar.service';
import { WordComponent } from './components/word/word.component';
import { UserService } from './services/UserService';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { authGuard } from './config/AuthGuard';
import { AuthInterceptor } from './config/AuthInterceptor';
import { SignupComponent } from './components/signup/signup.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { AuthService } from './services/AuthService';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SecureService } from './services/SercureService';
import { FormsModule } from '@angular/forms';
import { BrowserModule  } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@NgModule({ 
    declarations: [
        AppComponent,
        WordsComponent,
        NotFoundComponent,
        TestsComponent,
        HomeComponent,
        AddWordComponent,
        NavbarComponent,
        FooterComponent,
        WordComponent,
        LoginComponent,
        SignupComponent,
        ResetPasswordComponent,
        UserPageComponent,
        DashboardComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        FormsModule,
        // provideClientHydration(),
        // TransferHttpCacheModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'profile', component: UserPageComponent, canActivate: [authGuard] },
            { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
            { path: 'home', component: HomeComponent },
            { path: 'add-word', component: AddWordComponent },
            { path: 'words', component: WordsComponent },
            { path: 'words/:searchKey', component: WordComponent },
            { path: 'tests', component: TestsComponent },
            { path: 'search/:searchKey', component: WordComponent },
            //404 Not Found
            { path: '**', component: NotFoundComponent },
        ])
    ], 
    providers: [
        DictionaryService, NavBarService, UserService, AuthService, SecureService, DatePipe,
        { 
            provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
        provideHttpClient(withInterceptorsFromDi()),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
export class AppModule { }
