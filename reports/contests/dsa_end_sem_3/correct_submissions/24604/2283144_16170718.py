def findDifference(N, nums):
    os=0
    es=0
    for i in nums:
        if i%2==0:
            es+=i
        else:
            os+=i

    return es-os