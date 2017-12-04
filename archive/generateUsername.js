// GenerateUsername finds a unique username from a person's first and last name
function GenerateUsername(firstName, lastName, num=0) {

    // initialize hex
    var username = firstName.toLowerCase() + "-" + lastName.toLowerCase();
    if (num > 0) {
        username = username + num.toString();
    }

    UsernameExists(username).then(exists => {
        if (exists) {
            return GenerateUsername(firstName, lastName, num=num+1);
        }
        else {
            return username
        }
    })

}