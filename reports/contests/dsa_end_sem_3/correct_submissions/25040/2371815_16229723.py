def matchingNumber(s, t):

    j = 0

    for i in s:

        if j < len(t) and i == t[j]:
            j += 1

    return j == len(t)