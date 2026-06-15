def matchingNumber(s, t):
    a = False
    b = 0
    if len(t) > len(s):
        return False
    else:
        for i in range(len(t)):
            a = False
            while b < len(s):
                if s[b] == t[i]:
                    a = True
                    b = b+1
                    break
                b += 1
            if a == False:
                return False
    return True