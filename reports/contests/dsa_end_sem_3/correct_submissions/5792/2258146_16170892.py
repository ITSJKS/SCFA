def nextGreatestLetter(letters, target):
    l, r = 0, len(letters) - 1

    ans = letters[0]
    while l <= r:
        m = (l + r) // 2

        if letters[m] > target:
            ans = letters[m]
            r = m - 1
        else:
            l = m + 1
    
    return ans