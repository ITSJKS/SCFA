def findDifference(N, nums):
    eve=[]
    odd=[]
    for i in nums:
        if i%2!=0:
            odd.append(i)
        else:
            eve.append(i)

    return (sum(eve)-sum(odd))