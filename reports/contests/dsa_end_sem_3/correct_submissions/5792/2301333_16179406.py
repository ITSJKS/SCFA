def nextGreatestLetter(letters, target):
    
    a = 0
    b = len(letters)-1
    gen = -1
    while a<=b:
        mid = (a+b)//2
        if letters[mid] == target:
            gen = letters[mid+1]
            a = mid + 1
        elif letters[mid]>target:
            gen = letters[mid]
            b = mid -1
        else:
            a = mid + 1
    if gen == -1:
        return letters[0]
    return gen
    # arr = []
    # for i in range(len(letters)):
    #     if letters[i]>target:
    #         arr.append(letters[i])
    #         break
    # return arr[0]