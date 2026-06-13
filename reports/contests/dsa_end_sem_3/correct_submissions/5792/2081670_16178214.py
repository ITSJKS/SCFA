def nextGreatestLetter(letters, target):
    # mini = "z"
    # found = False
    # for ch in letters:
    #     if target < ch <= mini:
    #         mini = ch
    #         found = True
    # if found:
    #     return mini
    # else:
    #     return letters[0]

    start = 0
    end = len(letters)-1
    maxi = "z"
    found = False
    while start <= end:
        mid = (start+end)//2
        if target < letters[mid]:
            maxi = letters[mid]
            end = mid -1
            found = True
        else:
            start = mid+1

    if found:
        return maxi
    else:
        return letters[0]