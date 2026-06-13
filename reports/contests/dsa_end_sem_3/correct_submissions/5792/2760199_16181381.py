def nextGreatestLetter(letters, target):

    # for i in range(len(letters)):
    #     for j in range(i+1,len(letters)):
    #         if target < letters[j]:
    #             ans = letters[j]
    # return ans
    
    s= 0
    e = len(letters) - 1
    while s<=e:
        m = (s+e)//2
        if target<letters[m]:
            e = m-1
        else:
            s = m+1
    
    if target >= letters[len(letters) - 1] :
        return letters[0]
        
    return letters[s]