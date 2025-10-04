#include<iostream>
using namespace std;

class empleado{
    private://Nace de la relacio tiene
    char nombre[10];
    int edad;
    char direccion[255];
    int telefono;
    public://Interfaz y nace de la relacion usa

    int LeerEdad(){
        return edad;
    }
};//-->

int main(int argc, char const *argv[])
{
    //Tamaño de memoria estatica
    //Enteros
    cout << "Tamaño de int"<<sizeof(int) <<endl;
    cout << "Tamaño de long"<<sizeof(long) << endl;
    //Punto Flotante
     cout << "Tamaño de float" << sizeof(float) << endl;
     cout << "Tamaño de double" << sizeof(double) << endl;
     //Bytes
     cout << "Tamaño de char" << sizeof(char) << endl;
     cout << "Tamaño de byte" << siceof(byte) << endl;
     cout << "Tamaño de bool" sizeof(bool) << endl;
     //Tamaño tipos no nativos
     empleado empleados[10];//<--- 2730 B
     cout <<"Tamaño Empleados" << sizeof(empleado) << endl;
     cout <<"Empleados" << empleados[0].LeerEdad() << endl;

     //Casteos
     int a = 64;
     char b = (char) a;
     cout << b << endl;


    return 0;
}