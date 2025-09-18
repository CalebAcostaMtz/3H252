#pragma once
#include <EstadoFoco.hpp>

class Foco;
{
private:
  EstadoFoco estadoActual;

public:
   foco () {estadoActual=false; }
   ~foco () {}
   void Encender(){}
   void apagar (){}
   EstadoFoco MostrarEstado(){}
};
