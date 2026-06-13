def nextGreatestLetter(let, t):
    l = 0
    r = len(let) - 1

    while (l <= r):
        mid = (l + r) // 2

        if (let[mid] == t):

            # move to last occurrence of t
            while (mid < len(let) and let[mid] == t):
                mid += 1

            # wrap around case
            if (mid == len(let)):
                return let[0]
            else:
                return let[mid]

        elif (let[mid] > t):
            r = mid - 1
        else:
            l = mid + 1

    # when exact t not found
    if (l < len(let)):
        return let[l]

    return let[0]