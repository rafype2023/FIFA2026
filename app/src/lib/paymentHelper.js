export function getPlayerPayment(player) {
  if (!player) return { isDeudor: true, label: "DEUDOR", amount: 0 };
  
  const idStr = player._id ? player._id.toString() : "";
  const email = (player.email || "").toLowerCase().trim();
  
  // Specific ID overrides for cases where the same person submitted multiple entries 
  // but only paid for a subset, or for disambiguating duplicate names.
  if (idStr === "6a29f9c2b60114f6ec366488") {
    // Héctor Omar's second entry
    return { isDeudor: true, label: "DEUDOR", amount: 0 };
  }
  if (idStr === "6a2af170b60114f6ec3664db") {
    // Alejo Alvear's second entry (Alejo Alvear2)
    return { isDeudor: true, label: "DEUDOR", amount: 0 };
  }

  // List of emails matching players explicitly marked/confirmed as unpaid (DEUDOR)
  const deudoresEmails = [
    "jesus_guevara@yahoo.com",
    "rafyperez@hotmail.com",
    "bus.ballast.4i@icloud.com",
    "juanluisespinoza@gmail.com",
    "aj.perezrodz@gmail.com"
  ];
  if (deudoresEmails.includes(email)) {
    return { isDeudor: true, label: "DEUDOR", amount: 0 };
  }

  // Check matching by exact email
  switch (email) {
    case "alejo_alvear@yahoo.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "alf11a@hotmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "bolivar.rodriguez@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "d7claudio@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "gmartinpr@yahoo.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "guillehv@yahoo.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "alvarezho@gmail.com":
      // First entry of Hector Omar (Hector Alvarez)
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "irmarismt@icloud.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "colonivan662@yahoo.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "icolon15@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "jl08040@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "jrafy23@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "jlezcano@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "cani3737@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "jjdg1788@outlook.com":
      return { isDeudor: false, label: "$50.00", amount: 50 }; // Juan Diaz paid $50
    case "nievesjr444@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "karimalberty@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "luisbarvelo@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "mannyclaudio14@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "marianaisabeljimenez@gmail.com":
      return { isDeudor: false, label: "$20.00", amount: 20 }; // Mariana Jimenez paid $20
    case "mariselape@hotmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "miguelenrique710@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "migurms@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "roxanna.pulliza@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "saralovesben1973@yahoo.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "vortiz123@hotmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "yaneishaperezpadilla@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "ye_grc@yahoo.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "yolimarpinero@hotmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "yomar.op@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "tlealgonzalez@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "frodrig@me.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "amaury.santiago@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
    case "mivancy@gmail.com":
      return { isDeudor: false, label: "$10.00", amount: 10 };
  }

  // Fallback check by name (for any newly added players not in the initial lists)
  const normName = (player.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  if (normName.includes("alejandro alvear") || normName.includes("alejo alvear")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("alfredo mendez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("bolivar rodriguez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("damaris claudio")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("gilberto martinez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("guillermo hernandez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("hector alvarez") || normName.includes("hector omar")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("irmaris montanez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("ivan colon")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("jesus lopez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("jose gonzalez") || normName.includes("rafy gonzalez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("jose lezcano")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("jose nieves") || normName.includes("cani nieves")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("juan diaz")) {
    return { isDeudor: false, label: "$50.00", amount: 50 };
  }
  if (normName.includes("juan nieves")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("karim alberty")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("luis arvelo")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("manuel claudio")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("mariana jimenez")) {
    return { isDeudor: false, label: "$20.00", amount: 20 };
  }
  if (normName.includes("marisela reyes")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("miguel lopez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("miguel r marrero") || normName.includes("miguel marrero")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("roxanna pulliza")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("sara claudio")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("vanessa ortiz")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("yaneisha perez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("yelitza garcia")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("yolimar pinero")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("yomar otero") || normName.includes("lucas otero") || normName.includes("tatiana leal")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("fernando rodriguez")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("amaury santiago")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }
  if (normName.includes("ivan marrero")) {
    return { isDeudor: false, label: "$10.00", amount: 10 };
  }

  // Fallback default is DEUDOR
  return { isDeudor: true, label: "DEUDOR", amount: 0 };
}
