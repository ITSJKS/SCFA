def nextGreatestLetter(letters, target):
    s = 0
    e = len(letters) - 1
    ans = 0

    while s <= e:
        m = (s+e)//2
        if ord(letters[m]) > ord(target):
            ans = letters[m]
            e = m - 1
        else:
            s = m + 1
    
    if ans == 0:
        return letters[0]
    
    return ans
    # ans = {}
    # b = ord(target)

    # for i in range(len(letters)):
    #     if target != letters[i] and (ord(letters[i]) > ord(target)):
    #         ans[letters[i]] = ord(letters[i])

    # a = 1000
    # c = 0
    # for key in ans:
    #     if ans[key] < a and ans[key] > ord(target):
    #         c = key
    #         a = ans[key]
    # return c