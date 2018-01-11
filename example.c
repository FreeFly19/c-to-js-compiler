printf("Hello World");

int a = 5;

int b = 10;

if (a > b && b & 2 == 2 || a & 3 == 3) {
    printf("true");

    int i;
    for(i = 0; i < 10; i++) {
        if(a > i) printf("i = %d", i);
    }
} else {
    printf("false");
}
